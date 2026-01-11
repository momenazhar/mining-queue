declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_CLIENT_TOKEN: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_QUEUE_CHANNEL_ID: string;
      DISCORD_GUILD_ID: string;
      DISCORD_MOD_ROLE_ID: string;
      DISCORD_CLIENT_CREATOR_ID: string;
    }
  }
}

export {};
