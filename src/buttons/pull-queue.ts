import { MessageFlags, type ButtonInteraction, type CacheType } from "discord.js";
import { selling } from "../selling/index.ts";
import { addThreadMember } from "../rest.ts";
import { updateSaleMessage } from "../selling/message.ts";
import { queue } from "../queue/index.ts";
import { errorEmbed } from "../errors.ts";
import { updateQueueMessage } from "../queue/message.ts";

export async function onPullQueueClick(interaction: ButtonInteraction<CacheType>) {
  const sale = selling.getSaleByThreadId(interaction.channelId);

  if (!sale) {
    await interaction.reply(errorEmbed("threadIsNotSale"));
    return;
  }

  if (queue.members.length === 0) {
    await interaction.reply(errorEmbed("cantPullBecauseQueueEmpty"));
    return;
  }

  const members = queue.sell(1);
  const memberId = members[0]!.id;
  sale.memberIds.push(memberId);

  await selling.write();
  await queue.write();

  return Promise.all([
    interaction.reply({
      content: "Success",
      flags: MessageFlags.Ephemeral,
    }),
    addThreadMember(sale.threadId, memberId),
    updateSaleMessage(sale),
    updateQueueMessage(queue),
  ]);
}
