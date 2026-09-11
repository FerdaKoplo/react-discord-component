import { useDiscordState } from "../hooks/useDiscordState";
import type { MyAppState } from "../interfaces/interface";

export const useDiscord = useDiscordState<MyAppState>(
  { count: 0, user: "Kenny" },
  {
    botToken: import.meta.env.VITE_DISCORD_BOT_TOKEN,
    webhookUrl: import.meta.env.VITE_DISCORD_WEBHOOK_URL,
    channelId: import.meta.env.VITE_DISCORD_CHANNEL_ID,
  },
);
