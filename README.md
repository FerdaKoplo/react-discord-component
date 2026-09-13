# Lyrical Cluster Uhh Something Something

NoSQL blob storage engine built entirely on top of Discord's infrastructure. It bypasses conventional database limits by sharding Base64 image data, injecting it into South Park theme song lyrics, and transmitting it across Discord's WebSocket and REST APIs.

## Hooks

- **useDiscordBlob** Manages real-time data flow. It handles the FileReader conversion, chunking math, and the uploadImageToDiscord POST loop. It also houses the WebSocket listener that actively stitches incoming shards together as they arrive in the channel.

- **useQueryDiscordBlob** act as query. It exports scanForRecentImages to act as a directory indexer, and queryBlobFromDiscord to fetch, sort, and safely reassemble specific past images from Discord's historical REST API.

- **encodeStatetoSouthPark** utility function that serializes JSON packet data and injects it specifically into the bracketed [ ] zones of the lyrics for safe transmission.

## Setup & Configuration

**1. Discord Bot & Channel Prep**

- Create a Discord server and a dedicated storage channel (for example : `#images-memory`).
- Create a Webhook specifically for that channel to handle the rapid POST requests.
- Create a Bot in the Discord Developer Portal and invite it to your server.
- **Critical Permissions:** You must give the bot the `View Channel` and `Read Message History` permissions explicitly in the `#images-memory` channel settings to read past data.

**2. Install the Project**

- **Install Dependencies**

```bash
npm install
```

- **Start the Development Server, ensure you restart this anytime you update your .env or vite.config.ts)**
  Spin up the MySQL container using Docker Compose:

```bash
npm run dev
```

**3. Environment Variables**
Create a `.env` file at the root of your Vite project:

```env
# Do NOT include quotes or the word "Bot " in the token
VITE_DISCORD_BOT_TOKEN=
VITE_DISCORD_WEBHOOK_URL=
VITE_DISCORD_CHANNEL_ID=

VITE_BLOB_DISCORD_WEBHOOK_URL=
VITE_BLOB_DISCORD_CHANNEL_ID=
```

4.**Setting Up Vite Config**
Update your Vite configuration to intercept Discord API calls and spoof a secure backend environment to bypass CORS and 403 Forbidden errors:

```vite.config.ts
  server: {
    proxy: {
      "/discord-api": {
        target: "https://discord.com/api/v10",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/discord-api/, ""),
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            proxyReq.setHeader(
              "User-Agent",
              "DiscordBot (https://github.com/my-cluster, 1.0.0)",
            );

            proxyReq.removeHeader("Origin");
            proxyReq.removeHeader("Referer");
            proxyReq.removeHeader("sec-ch-ua");
          });
        },
      },
    },
  },
```
