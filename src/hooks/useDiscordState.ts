import { create } from "zustand";
import type { DiscordStore } from "../interfaces/interface";
import {
  type DiscordClusterConfig,
  type DiscordGatewayPayload,
  type HelloPayload,
  type MessageCreatePayload,
} from "../interfaces/interface";
import { persist } from "zustand/middleware";
import { decodeStateFromSouthPark } from "../libs/decode";
import { encodeStatetoSouthPark } from "../libs/encode";

export const createDiscordCluster = <T>(
  initialState: T,
  config: DiscordClusterConfig,
  storageKey: string = "south-park-dr-backup",
) => {
  const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
  let heartbeatInterval: number;

  return create<DiscordStore<T>>()(
    persist(
      (set) => {
        ws.onmessage = (event: MessageEvent) => {
          const payload = JSON.parse(
            event.data as string,
          ) as DiscordGatewayPayload;

          if (payload.op === 10) {
            const data = payload.d as HelloPayload;
            heartbeatInterval = window.setInterval(() => {
              ws.send(JSON.stringify({ op: 1, d: null }));
            }, data.heartbeat_interval);

            ws.send(
              JSON.stringify({
                op: 2,
                d: {
                  token: config.botToken,
                  intents: 33281,
                  properties: {
                    $os: "linux",
                    $browser: "ZustandHA",
                    $device: "Frankenstein",
                  },
                },
              }),
            );
          }

          if (payload.op === 0 && payload.t === "MESSAGE_CREATE") {
            const message = payload.d as MessageCreatePayload;
            console.log("RECEIVED FROM DISCORD:", message);
            if (message.channel_id === config.channelId && message.webhook_id) {
              const newState = decodeStateFromSouthPark<T>(message.content);
              if (newState) {
                set({ state: newState });
              }
            }
          }
        };

        ws.onclose = () => {
          if (heartbeatInterval) {
            window.clearInterval(heartbeatInterval);
          }
        };
        return {
          state: initialState,
          setDiscordState: async (newState: T) => {
            try {
              const lyricalPayload = encodeStatetoSouthPark(newState);
              await fetch(config.webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  content: lyricalPayload,
                  username: "Cartman Store",
                }),
              });
            } catch (err) {
              console.error("Failed to write to lyrical memory cluster", err);
            }
          },
        };
      },
      {
        name: storageKey,
        partialize: (store) => ({ state: store.state }),
      },
    ),
  );
};
