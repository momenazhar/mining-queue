import { type ButtonInteraction, GuildMemberRoleManager, type CacheType } from "discord.js";
import type { Sale } from "./index.ts";

export function isSellerOrModerator(interaction: ButtonInteraction<CacheType>, sale: Sale) {
  let isModerator = false;
  if (interaction.member?.roles instanceof GuildMemberRoleManager) {
    isModerator = interaction.member.roles.cache.has(process.env.DISCORD_MOD_ROLE_ID);
  } else {
    isModerator = interaction.member?.roles?.includes(process.env.DISCORD_MOD_ROLE_ID) ?? false;
  }

  return isModerator || interaction.user.id === sale.seller.id;
}
