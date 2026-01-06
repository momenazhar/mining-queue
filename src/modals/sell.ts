import {
  MessageFlags,
  ChannelType,
  type CacheType,
  type ModalSubmitInteraction,
} from "discord.js";
import { queue } from "../queue/index.ts";
import { updateQueueMessage } from "../queue/message.ts";
import { addThreadMembers, createThread } from "../rest.ts";

export async function onSellSubmit(
  interaction: ModalSubmitInteraction<CacheType>,
) {
  if (queue.members.length === 0) {
    return interaction.reply({
      content: "You can't sell since the queue is empty",
      flags: MessageFlags.Ephemeral,
    });
  }

  const [value] = interaction.fields.getStringSelectValues("members");
  const amountOfMembers = parseInt(value!);

  const members = queue.sell(interaction.user.id, amountOfMembers);
  await queue.write();
  await updateQueueMessage(queue);

  const thread = await createThread(process.env.DISCORD_QUEUE_CHANNEL_ID, {
    type: ChannelType.PrivateThread,
    name: `${interaction.user.displayName}`,
    invitable: false,
  });

  await Promise.all([
    addThreadMembers(thread.id, interaction.user.id),
    ...members.map((member) => addThreadMembers(thread.id, member.id)),
  ]);

  return interaction.reply({
    content: `Created a thread <#${thread.id}>`,
    flags: MessageFlags.Ephemeral,
  });
}
