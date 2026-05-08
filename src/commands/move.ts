import { MessageFlags, type CacheType, type ChatInputCommandInteraction } from "discord.js";

import { queue } from "../queue/index.ts";
import { updateQueueMessage } from "../queue/message.ts";
import { embedReply } from "../embeds.ts";
import { messages } from "../messages.ts";

export async function move(interaction: ChatInputCommandInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const user = interaction.options.getUser("user", true);
  const position = interaction.options.getInteger("position", true);

  const moved = queue.move(user.id, position - 1);

  if (!moved) {
    await interaction.editReply(embedReply("error", messages.moveQueue.notInQueue));
    return;
  }

  await queue.write();
  await updateQueueMessage(queue);

  await interaction.editReply(embedReply("info", messages.moveQueue.moved(user.id, position)));
}
