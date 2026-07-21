import { type ButtonInteraction, GuildMemberRoleManager, type CacheType } from "discord.js";
import type { Sale } from "./index.ts";

export function isModerator(interaction: ButtonInteraction<CacheType>) {
  if (interaction.member?.roles instanceof GuildMemberRoleManager) {
    return interaction.member.roles.cache.has(process.env.DISCORD_MOD_ROLE_ID);
  }
  return interaction.member?.roles?.includes(process.env.DISCORD_MOD_ROLE_ID) ?? false;
}

export function isSellerOrModerator(interaction: ButtonInteraction<CacheType>, sale: Sale) {
  return isModerator(interaction) || interaction.user.id === sale.seller.id;
}
