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
import { onJoinClick } from "./buttons/join.ts";
import { onLeaveClick } from "./buttons/leave.ts";
import { onSellClick } from "./buttons/sell.ts";
import { onSellSubmit } from "./modals/sell.ts";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
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
  [config.buttons.queueJoinId]: onJoinClick,
  [config.buttons.queueLeaveId]: onLeaveClick,
  [config.buttons.queueSellId]: onSellClick,
};

const commands: Record<string, CommandHandler> = {
  sync,
};

const modals: Record<string, ModalHandler> = {
  [config.modals.queueSellId]: onSellSubmit,
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

client.login(process.env.DISCORD_CLIENT_TOKEN);
