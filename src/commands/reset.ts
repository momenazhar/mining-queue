import { MessageFlags, type CacheType, type ChatInputCommandInteraction } from "discord.js";
import { updateQueueMessage } from "../queue/message.ts";
import { queue } from "../queue/index.ts";
import { embedReply } from "../embeds.ts";
import { messages } from "../messages.ts";

export async function reset(interaction: ChatInputCommandInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  queue.members = [];
  await queue.write();

  await updateQueueMessage(queue);
  await interaction.editReply(embedReply("info", messages.commands.reset));
}
