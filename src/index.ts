import {
  ButtonInteraction,
  type CacheType,
  ChatInputCommandInteraction,
  Client,
  Events,
  GatewayIntentBits,
  ModalSubmitInteraction,
  Options,
} from "discord.js";
import { sync } from "./commands/sync.ts";
import { config } from "./config.ts";
import { onJoinQueueClick } from "./buttons/join-queue.ts";
import { onLeaveQueueClick } from "./buttons/leave-queue.ts";
import { onCreateSaleClick } from "./buttons/create-sale.ts";
import { onCreateSaleSubmit } from "./modals/create-sale.ts";
import { reset } from "./commands/reset.ts";
import { queue } from "./queue/index.ts";
import { updateQueueMessage } from "./queue/message.ts";
import { selling } from "./selling/index.ts";
import { deleteChannel, sendMessage } from "./rest.ts";
import { leaveSale, onLeaveSaleClick } from "./buttons/leave-sale.ts";
import { onCloseSaleClick } from "./buttons/close-sale.ts";
import { onPositionQueueClick } from "./buttons/position-queue.ts";
import { onPullQueueClick } from "./buttons/pull-queue.ts";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  makeCache: Options.cacheWithLimits({}),
});

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

type ButtonHandler = (interaction: ButtonInteraction<CacheType>) => void;
type CommandHandler = (
  interaction: ChatInputCommandInteraction<CacheType>,
) => void;
type ModalHandler = (interaction: ModalSubmitInteraction<CacheType>) => void;

const buttons: Record<string, ButtonHandler> = {
  [config.buttons.queueJoinId]: onJoinQueueClick,
  [config.buttons.queueLeaveId]: onLeaveQueueClick,
  [config.buttons.createSaleId]: onCreateSaleClick,
  [config.buttons.leaveSaleId]: onLeaveSaleClick,
  [config.buttons.closeSaleId]: onCloseSaleClick,
  [config.buttons.queuePositionId]: onPositionQueueClick,
  [config.buttons.pullQueueId]: onPullQueueClick,
};

const commands: Record<string, CommandHandler> = {
  [config.commands.sync.name]: sync,
  [config.commands.reset.name]: reset,
};

const modals: Record<string, ModalHandler> = {
  [config.modals.createSaleId]: onCreateSaleSubmit,
};

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    buttons[interaction.customId]?.(interaction);
  }

  if (interaction.isChatInputCommand()) {
    commands[interaction.commandName]?.(interaction);
  }

  if (interaction.isModalSubmit()) {
    modals[interaction.customId]?.(interaction);
  }
});

client.on(Events.GuildMemberRemove, async (member) => {
  if (queue.contains(member.id)) {
    queue.leave(member.id);
    await queue.write();
    await updateQueueMessage(queue);
  }

  if (selling.containsSeller(member.id)) {
    for (const sale of selling.sales.filter(
      (sale) => sale.seller.id === member.id,
    )) {
      selling.deleteSale(sale.seller.id);
      await selling.write();
      await deleteChannel(sale.threadId);
    }
  }

  if (selling.containsMember(member.id)) {
    for (const sale of selling.sales.filter((sale) =>
      sale.memberIds.includes(member.id),
    )) {
      await leaveSale(sale, member.id);
    }
  }
});

client.on(Events.ThreadDelete, async (thread) => {
  selling.sales = selling.sales.filter((sale) => sale.threadId !== thread.id);
  await selling.write();
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
