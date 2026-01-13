import {
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  type ButtonInteraction,
  type CacheType,
} from "discord.js";
import { queue } from "../queue/index.ts";
import { config } from "../config.ts";
import { selling } from "../selling/index.ts";
import { embedReply } from "../embeds.ts";
import { messages } from "../messages.ts";

export async function onCreateSaleClick(
  interaction: ButtonInteraction<CacheType>,
) {
  if (queue.contains(interaction.user.id)) {
    return interaction.reply(
      embedReply("error", messages.createSale.cannotSellInQueue),
    );
  }

  if (queue.members.length === 0) {
    return interaction.reply(
      embedReply("error", messages.createSale.emptyQueue),
    );
  }

  if (selling.containsSeller(interaction.user.id)) {
    return interaction.reply(
      embedReply("error", messages.createSale.alreadySelling),
    );
  }

  return interaction.showModal(
    new ModalBuilder()
      .setCustomId(config.modals.createSaleId)
      .setTitle("Sell")
      .addLabelComponents(
        new LabelBuilder()
          .setLabel("How many Golden Dragon Eggs are there?")
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
