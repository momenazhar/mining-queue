import { MessageFlags, type CacheType, type ChatInputCommandInteraction } from "discord.js";
import { updateQueueMessage } from "../queue/message.ts";
import { queue } from "../queue/index.ts";

export async function reset(interaction: ChatInputCommandInteraction<CacheType>) {
  queue.members = [];
  await queue.write();

  return Promise.all([
    interaction.reply({
      content: "Reset!",
      flags: MessageFlags.Ephemeral,
    }),
    updateQueueMessage(queue),
  ]);
}
