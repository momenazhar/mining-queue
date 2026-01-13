import { MessageFlags, type ButtonInteraction, type CacheType } from "discord.js";
import { selling, type Sale } from "../selling/index.ts";
import { deleteChannel, removeThreadMember } from "../rest.ts";
import { updateSaleMessage } from "../selling/message.ts";
import { embedReply } from "../embeds.ts";
import { messages } from "../messages.ts";

export async function onLeaveSaleClick(interaction: ButtonInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const sale = selling.getSaleByThreadId(interaction.channelId);

  if (!sale) {
    await interaction.editReply(embedReply("error", messages.leaveSale.threadNoSale));
    return;
  }

  if (sale.memberIds.every((id) => id !== interaction.user.id)) {
    await interaction.editReply(embedReply("error", messages.leaveSale.onlyMembersCanLeave));
    return;
  }

  await leaveSale(sale, interaction.user.id, async (deleted) => {
    await interaction.editReply(
      embedReply("error", deleted ? messages.leaveSale.allMembersLeft : messages.leaveSale.leaving),
    );
  });
}

export async function leaveSale(
  sale: Sale,
  memberId: string,
  onLeave?: (deleted: boolean) => void | Promise<void>,
) {
  sale.memberIds = sale.memberIds.filter((id) => id !== memberId);

  if (sale.memberIds.length === 0) {
    selling.deleteSale(sale.seller.id);

    await onLeave?.(true);

    await deleteChannel(sale.threadId);
    await selling.write();
  } else {
    await onLeave?.(false);

    await removeThreadMember(sale.threadId, memberId);
    await selling.write();

    await updateSaleMessage(sale);
  }
}
