import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const discordEndpoint = req.url?.replace("/api/discord", "") || "";

  try {
    const response = await fetch(
      `https://discord.com/api/v10${discordEndpoint}`,
      {
        method: req.method,
        headers: {
          Authorization: req.headers.authorization || "",
          "Content-Type": "application/json",
          "User-Agent": "DiscordBot (https://github.com/cluster, 1.0.0)",
        },
        body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
      },
    );

    if (response.status === 204) {
      return res.status(204).end();
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Vercel Proxy Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to proxy request to Discord" });
  }
}
