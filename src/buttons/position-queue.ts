import { MessageFlags, type ButtonInteraction, type CacheType } from "discord.js";
import { queue } from "../queue/index.ts";

export async function onPositionQueueClick(interaction: ButtonInteraction<CacheType>) {
  if (!queue.contains(interaction.user.id)) {
    return interaction.reply({
      content: "You are not in the queue",
      flags: MessageFlags.Ephemeral,
    });
  }

  const index = queue.members.findIndex((member) => member.id === interaction.user.id);

  return interaction.reply({
    content: `You are position \`#${index + 1}\` in the queue`,
    flags: MessageFlags.Ephemeral,
  });
}
