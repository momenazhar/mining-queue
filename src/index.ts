import { type CacheType, ChatInputCommandInteraction, Client, Events, GatewayIntentBits, Options } from "discord.js";
import { config } from "./config.ts";
import { fiesta } from "./commands/fiesta.ts";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  makeCache: Options.cacheWithLimits({}),
});

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

type CommandHandler = (interaction: ChatInputCommandInteraction<CacheType>) => void;

const commands: Record<string, CommandHandler> = {
  [config.commands.fiesta.name]: fiesta,
};

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    commands[interaction.commandName]?.(interaction);
  }
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
