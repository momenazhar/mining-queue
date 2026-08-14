import {
  GuildMemberRoleManager,
  type ButtonInteraction,
  type CacheType,
  type ModalSubmitInteraction,
} from "discord.js";

export function getMemberRoleIds(
  interaction: ButtonInteraction<CacheType> | ModalSubmitInteraction<CacheType>,
): string[] {
  if (interaction.member?.roles instanceof GuildMemberRoleManager) {
    return [...interaction.member.roles.cache.keys()];
  }
  return interaction.member?.roles ?? [];
}
