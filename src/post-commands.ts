import { Routes } from "discord.js";
import { config } from "./config.ts";
import { rest } from "./rest.ts";

console.log("Started refreshing application (/) commands.");

await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
  body: Object.values(config.commands),
});

console.log("Successfully reloaded application (/) commands.");
