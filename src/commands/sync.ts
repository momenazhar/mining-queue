import { type CacheType, type ChatInputCommandInteraction } from "discord.js";
import { queue } from "../queue/index.ts";
import { updateQueueMessage } from "../queue/message.ts";

export async function sync(
  interaction: ChatInputCommandInteraction<CacheType>,
) {
  await interaction.deferReply();
  await updateQueueMessage(queue);
  await interaction.editReply({ content: "Synced!" });
}
