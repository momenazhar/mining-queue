import {
  GuildMemberRoleManager,
  MessageFlags,
  type ButtonInteraction,
  type CacheType,
} from "discord.js";
import { selling } from "../selling/index.ts";
import { deleteChannel } from "../rest.ts";

export async function onCloseSaleClick(interaction: ButtonInteraction<CacheType>) {
  const sale = selling.sales.find((s) => s.threadId === interaction.channelId);

  if (!sale) {
    await interaction.reply({
      content: "This thread is not assiocated with a sale",
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  let isModerator = false;

  if (interaction.member?.roles instanceof GuildMemberRoleManager) {
    isModerator = interaction.member.roles.cache.has(process.env.DISCORD_MOD_ROLE_ID);
  } else {
    isModerator = interaction.member?.roles?.includes(process.env.DISCORD_MOD_ROLE_ID) ?? false;
  }

  if (!(isModerator || interaction.user.id === sale.seller.id)) {
    await interaction.reply({
      content: "Only moderators or the seller can close a sale",
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  selling.deleteSale(sale.seller.id);
  await selling.write();

  await interaction.reply({
    content: "Deleting",
    flags: MessageFlags.Ephemeral,
  });

  await deleteChannel(sale.threadId);
}
