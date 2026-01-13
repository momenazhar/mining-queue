import { MessageFlags, type ButtonInteraction, type CacheType } from "discord.js";
import { selling } from "../selling/index.ts";
import { deleteChannel } from "../rest.ts";
import { embedReply } from "../embeds.ts";
import { messages } from "../messages.ts";
import { isSellerOrModerator } from "../selling/util.ts";

export async function onCloseSaleClick(interaction: ButtonInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const sale = selling.sales.find((s) => s.threadId === interaction.channelId);

  if (!sale) {
    await interaction.editReply(embedReply("error", messages.closeSale.threadNoSale));
    return;
  }

  if (!isSellerOrModerator(interaction, sale)) {
    await interaction.editReply(embedReply("error", messages.closeSale.cannotClose));
    return;
  }

  selling.deleteSale(sale.seller.id);
  await selling.write();

  await interaction.editReply(embedReply("info", messages.closeSale.threadDelete));
  await deleteChannel(sale.threadId);
}
