import { create } from "zustand";
import type {
  BlobStore,
  DiscordClusterConfig,
  DiscordGatewayPayload,
  ImageChunkPacket,
} from "../interfaces/interface";
import { encodeStatetoSouthPark } from "../libs/encode";
import { useToastStore } from "../zustand/useToastStore";

const activeImageBuffers: Record<
  string,
  { total: number; chunks: Record<number, string> }
> = {};

export const createDiscordBlobStore = (config: DiscordClusterConfig) => {
  const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
  let heartbeatInterval: number;

  return create<BlobStore>((set) => {
    ws.onmessage = (event: MessageEvent) => {
      const payload = JSON.parse(event.data as string) as DiscordGatewayPayload;

      if (payload.op === 10) {
        const data = payload.d as { heartbeat_interval: number };
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
                $browser: "BlobCluster",
                $device: "Frankenstein",
              },
            },
          }),
        );
      }

      if (payload.op === 0 && payload.t === "MESSAGE_CREATE") {
        const message = payload.d as {
          channel_id: string;
          webhook_id?: string;
          content: string;
        };
        if (message.channel_id === config.channelId && message.webhook_id) {
          const match = message.content.match(/\[(.*?)\]/);
          if (!match || !match[1]) return;

          const packet = JSON.parse(atob(match[1])) as ImageChunkPacket;
          if (!packet.id || typeof packet.idx !== "number" || !packet.data)
            return;

          if (!activeImageBuffers[packet.id]) {
            activeImageBuffers[packet.id] = {
              total: packet.total,
              chunks: {},
            };
          }

          activeImageBuffers[packet.id].chunks[packet.idx] = packet.data;
          const current = activeImageBuffers[packet.id];

          if (Object.keys(current.chunks).length === current.total) {
            let fullBase64 = "";
            for (let i = 1; i <= current.total; i++) {
              fullBase64 += current.chunks[i];
            }
            delete activeImageBuffers[packet.id];
            set({ latestImage: fullBase64, isUploading: false });
          }
        }
      }
    };

    return {
      latestImage: null,
      isUploading: false,
      uploadImageToDiscord: async (file: File) => {
        set({ isUploading: true });
        const reader = new FileReader();

        reader.onload = async () => {
          const fullBase64 = reader.result as string;
          const imageId = `img_${Date.now()}`;
          const chunkSize = 800;
          const chunks: string[] = [];
          const totalShards = chunks.length;

          for (let i = 0; i < fullBase64.length; i += chunkSize) {
            chunks.push(fullBase64.substring(i, i + chunkSize));
          }

          for (let i = 0; i < chunks.length; i++) {
            const packet: ImageChunkPacket = {
              id: imageId,
              idx: i + 1,
              total: chunks.length,
              data: chunks[i],
            };

            const lyricalPacket = encodeStatetoSouthPark(packet);
            let success = false;
            let retryCount = 0;

            while (!success && retryCount < 5) {
              const response = await fetch(config.webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  content: lyricalPacket,
                  username: `DB Shard ${i + 1}/${chunks.length}`,
                }),
              });

              const currentShard = i + 1;

              useToastStore
                .getState()
                .showToast(
                  `Uploading DB Shard ${currentShard}/${totalShards}...`,
                  "progress",
                );

              if (response.status === 429) {
                const retryAfter =
                  Number(response.headers.get("Retry-After")) || 2;
                console.warn(
                  `Shard ${i + 1} blocked. Sleeping for ${retryAfter}s...`,
                );

                await new Promise((r) =>
                  setTimeout(r, retryAfter * 1000 + 100),
                );
                retryCount++;
              } else if (!response.ok) {
                console.error(
                  `Fatal error on shard ${i + 1}: ${response.statusText}`,
                );
                success = true;
              } else {
                success = true;

                await new Promise((r) => setTimeout(r, 400));
              }
            }
          }
          useToastStore
            .getState()
            .showToast(
              `Cluster Synced: All ${totalShards} Shards Uploaded!`,
              "success",
            );
        };

        reader.readAsDataURL(file);
      },
    };
  });
};
