import { MessageFlags, type ButtonInteraction, type CacheType } from "discord.js";
import { selling, type Sale } from "../selling/index.ts";
import { deleteChannel, removeThreadMember } from "../rest.ts";
import { updateSaleMessage } from "../selling/message.ts";

export async function onLeaveSaleClick(interaction: ButtonInteraction<CacheType>) {
  const sale = selling.getSaleByThreadId(interaction.channelId);

  if (!sale) {
    await interaction.reply({
      content: "This thread is not assiocated with a sale",
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  if (sale.memberIds.every((id) => id !== interaction.user.id)) {
    await interaction.reply({
      content: "Only members of the sale can leave",
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  await leaveSale(sale, interaction.user.id, async (deleted) => {
    await interaction.reply({
      content: deleted ? "Deleting sale since all members left" : "Leaving...",
      flags: MessageFlags.Ephemeral,
    });
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
