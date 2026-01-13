import { MessageFlags, type CacheType, type ChatInputCommandInteraction } from "discord.js";
import { queue } from "../queue/index.ts";
import { updateQueueMessage } from "../queue/message.ts";
import { messages } from "../messages.ts";
import { embedReply } from "../embeds.ts";
import { selling } from "../selling/index.ts";
import { updateSaleMessage } from "../selling/message.ts";

export async function sync(interaction: ChatInputCommandInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  await Promise.all([
    updateQueueMessage(queue),
    ...selling.sales.map((sale) => updateSaleMessage(sale)),
  ]);

  await interaction.editReply(embedReply("info", messages.commands.sync));
}
