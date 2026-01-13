import { MessageFlags, type ButtonInteraction, type CacheType } from "discord.js";
import { queue } from "../queue/index.ts";
import { embedReply } from "../embeds.ts";
import { messages } from "../messages.ts";

export async function onPositionQueueClick(interaction: ButtonInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  if (!queue.contains(interaction.user.id)) {
    await interaction.editReply(embedReply("error", messages.positionQueue.notInQueue));
    return;
  }

  const index = queue.members.findIndex((member) => member.id === interaction.user.id);

  await interaction.editReply(embedReply("info", messages.positionQueue.position(index + 1)));
}
