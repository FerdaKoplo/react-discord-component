import { createDiscordBlobStore } from "../hooks/useDiscordBlob";
import { createDiscordCluster } from "../hooks/useDiscordState";
import type { DiscordClusterConfig, MyAppState } from "../interfaces/interface";

const config: DiscordClusterConfig = {
  botToken: import.meta.env.VITE_DISCORD_BOT_TOKEN,
  webhookUrl: import.meta.env.VITE_DISCORD_WEBHOOK_URL,
  channelId: import.meta.env.VITE_DISCORD_CHANNEL_ID,
};

export const blobConfig: DiscordClusterConfig = {
  botToken: import.meta.env.VITE_DISCORD_BOT_TOKEN,
  webhookUrl: import.meta.env.VITE_BLOB_DISCORD_WEBHOOK_URL,
  channelId: import.meta.env.VITE_BLOB_DISCORD_CHANNEL_ID,
};

export const useDiscordState = createDiscordCluster<MyAppState>(
  { count: 0, user: "Kenny" },
  config,
  "south-park-state-backup",
);

export const useDiscordBlob = createDiscordBlobStore(blobConfig);
