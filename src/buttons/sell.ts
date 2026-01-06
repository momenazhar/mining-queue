import {
  LabelBuilder,
  MessageFlags,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  type ButtonInteraction,
  type CacheType,
} from "discord.js";
import { queue } from "../queue/index.ts";
import { config } from "../config.ts";

export async function onSellClick(interaction: ButtonInteraction<CacheType>) {
  if (queue.contains(interaction.user.id)) {
    return interaction.reply({
      content: "You can't sell if you are in the queue",
      flags: MessageFlags.Ephemeral,
    });
  }

  if (queue.members.length === 0) {
    return interaction.reply({
      content: "You can't sell since the queue is empty",
      flags: MessageFlags.Ephemeral,
    });
  }

  if (queue.selling.includes(interaction.user.id)) {
    return interaction.reply({
      content: "You can't sell since you are already selling",
      flags: MessageFlags.Ephemeral,
    });
  }

  return interaction.showModal(
    new ModalBuilder()
      .setCustomId(config.modals.queueSellId)
      .setTitle("Sell")
      .addLabelComponents(
        new LabelBuilder()
          .setLabel("How many people do you want to take?")
          .setStringSelectMenuComponent(
            new StringSelectMenuBuilder()
              .setCustomId("members")
              .setMinValues(1)
              .setMaxValues(1)
              .setRequired(true)
              .setOptions(
                new StringSelectMenuOptionBuilder()
                  .setLabel("One")
                  .setValue("1"),
                new StringSelectMenuOptionBuilder()
                  .setLabel("Two")
                  .setValue("2"),
                new StringSelectMenuOptionBuilder()
                  .setLabel("Three")
                  .setValue("3"),
              ),
          ),
      ),
  );
}
