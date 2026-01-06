import {
  MessageFlags,
  type ButtonInteraction,
  type CacheType,
} from "discord.js";
import { queue } from "../queue/index.ts";
import { updateQueueMessage } from "../queue/message.ts";

export async function onLeaveClick(interaction: ButtonInteraction<CacheType>) {
  queue.leave(interaction.user.id);
  await queue.write();
  await updateQueueMessage(queue);

  return interaction.reply({
    content: "You left the queue",
    flags: MessageFlags.Ephemeral,
  });
}
