import type {
  DiscordClusterConfig,
  ImageChunkPacket,
} from "../interfaces/interface";

export const queryBlobFromDiscord = async (
  config: DiscordClusterConfig,
  targetImageId: string,
): Promise<string | null> => {
  try {
    const response = await fetch(
      `/api/discord/channels/${config.channelId}/messages?limit=100`,
      {
        method: "GET",
        headers: {
          Authorization: `Bot ${config.botToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("TOKEN CHECK:", config.botToken);

    if (!response.ok) {
      throw new Error(`Database query failed: ${response.statusText}`);
    }

    const messages = (await response.json()) as Array<{ content: string }>;
    const chunksMap: Record<number, string> = {};
    let expectedTotal = 0;

    for (const msg of messages) {
      const match = msg.content.match(/\[(.*?)\]/);
      if (!match || !match[1]) continue;

      let packet: ImageChunkPacket;

      try {
        packet = JSON.parse(atob(match[1])) as ImageChunkPacket;
      } catch {
        continue;
      }

      if (packet.id === targetImageId) {
        chunksMap[packet.idx] = packet.data;
        expectedTotal = packet.total;
      }
    }

    const receivedIndices = Object.keys(chunksMap).map(Number);
    if (expectedTotal > 0 && receivedIndices.length === expectedTotal) {
      let fullBase64 = "";
      for (let i = 1; i <= expectedTotal; i++) {
        fullBase64 += chunksMap[i];
      }
      return fullBase64;
    }

    console.warn(`Record ${targetImageId} not found or incomplete shards.`);
    return null;
  } catch (err) {
    console.error("Failed to execute database query on Discord:", err);
    return null;
  }
};

export const scanForRecentImages = async (
  config: DiscordClusterConfig,
): Promise<string[]> => {
  try {
    const response = await fetch(
      `/api/discord/channels/${config.channelId}/messages?limit=100`,
      {
        method: "GET",
        headers: { Authorization: `Bot ${config.botToken}` },
      },
    );

    if (!response.ok) return [];
    const messages = (await response.json()) as Array<{ content: string }>;
    const foundIds = new Set<string>();

    for (const msg of messages) {
      const match = msg.content.match(/\[(.*?)\]/);
      if (!match || !match[1]) continue;

      try {
        const packet = JSON.parse(atob(match[1])) as ImageChunkPacket;
        if (packet.id) foundIds.add(packet.id);
      } catch {
        continue;
      }
    }
    return Array.from(foundIds);
  } catch (err) {
    console.error("Directory scan failed:", err);
    return [];
  }
};
