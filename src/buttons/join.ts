import {
  MessageFlags,
  type ButtonInteraction,
  type CacheType,
} from "discord.js";
import { queue } from "../queue/index.ts";
import { updateQueueMessage } from "../queue/message.ts";

export async function onJoinClick(interaction: ButtonInteraction<CacheType>) {
  const joined = queue.join(interaction.user.id);

  if (!joined) {
    return interaction.reply({
      content: "You are already in the queue",
      flags: MessageFlags.Ephemeral,
    });
  }

  await queue.write();
  await updateQueueMessage(queue);

  return interaction.reply({
    content: "Joined the queue!",
    flags: MessageFlags.Ephemeral,
  });
}
