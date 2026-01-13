import { MessageFlags, type ButtonInteraction, type CacheType } from "discord.js";
import { queue } from "../queue/index.ts";
import { updateQueueMessage } from "../queue/message.ts";
import { embedReply } from "../embeds.ts";
import { messages } from "../messages.ts";

export async function onLeaveQueueClick(interaction: ButtonInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  queue.leave(interaction.user.id);
  await queue.write();

  await updateQueueMessage(queue);
  await interaction.editReply(embedReply("info", messages.leaveQueue.left));
}
