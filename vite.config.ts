import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
});
