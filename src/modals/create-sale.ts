import { ChannelType, MessageFlags, type CacheType, type ModalSubmitInteraction } from "discord.js";
import { queue } from "../queue/index.ts";
import { updateQueueMessage } from "../queue/message.ts";
import { addThreadMember, createThread, sendMessage } from "../rest.ts";
import { selling } from "../selling/index.ts";
import { updateSaleMessage } from "../selling/message.ts";
import { messages } from "../messages.ts";
import { embedReply } from "../embeds.ts";

export async function onCreateSaleSubmit(interaction: ModalSubmitInteraction<CacheType>) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  if (queue.contains(interaction.user.id)) {
    await interaction.editReply(embedReply("error", messages.modals.cannotSellInQueue));
    return;
  }

  if (queue.members.length === 0) {
    await interaction.editReply(embedReply("error", messages.modals.emptyQueue));
    return;
  }

  if (selling.containsSeller(interaction.user.id)) {
    await interaction.editReply(embedReply("error", messages.modals.alreadySelling));
    return;
  }

  const [value] = interaction.fields.getStringSelectValues("members");
  const amountOfMembers = parseInt(value!);

  const members = queue.sell(amountOfMembers);
  await queue.write();
  await updateQueueMessage(queue);

  const thread = await createThread(process.env.DISCORD_QUEUE_CHANNEL_ID, {
    type: ChannelType.PrivateThread,
    name: `${interaction.user.displayName}`,
    invitable: false,
  });

  const sale = selling.createSale(
    { id: interaction.user.id, displayName: interaction.user.displayName },
    members.map((member) => member.id),
    thread.id,
  );

  await selling.write();

  await Promise.all([
    addThreadMember(thread.id, interaction.user.id),
    ...members.map((member) => addThreadMember(thread.id, member.id)),
  ]);

  await updateSaleMessage(sale);
  // TODO: ping oncall in embed instead of separate msg
  await sendMessage(thread.id, { content: `<@&${process.env.DISCORD_ONCALL_ROLE_ID}>` });

  await interaction.editReply(embedReply("info", messages.modals.createThread(thread.id)));
}
