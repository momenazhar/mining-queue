import { MessageFlags, type ButtonInteraction, type CacheType } from "discord.js";
import { selling } from "../selling/index.ts";
import { addThreadMember } from "../rest.ts";
import { updateSaleMessage } from "../selling/message.ts";
import { queue } from "../queue/index.ts";
import { updateQueueMessage } from "../queue/message.ts";
import { embedReply } from "../embeds.ts";
import { messages } from "../messages.ts";
import { isSellerOrModerator } from "../selling/util.ts";

export async function onPullQueueClick(interaction: ButtonInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const sale = selling.getSaleByThreadId(interaction.channelId);

  if (!sale) {
    await interaction.editReply(embedReply("error", messages.pullQueue.threadNoSale));
    return;
  }

  if (!isSellerOrModerator(interaction, sale)) {
    await interaction.editReply(embedReply("error", messages.pullQueue.cannotPull));
    return;
  }

  if (queue.members.length === 0) {
    await interaction.editReply(embedReply("error", messages.pullQueue.noPullEmptyQueue));
    return;
  }

  const members = queue.sell(1);
  const memberId = members[0]!.id;
  sale.memberIds.push(memberId);

  await selling.write();
  await queue.write();

  await Promise.all([
    addThreadMember(sale.threadId, memberId),
    updateSaleMessage(sale),
    updateQueueMessage(queue),
  ]);

  await interaction.editReply(embedReply("info", messages.pullQueue.pulled));
}
