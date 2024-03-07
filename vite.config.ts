import pages from "@hono/vite-cloudflare-pages";
import honox from "honox/vite";
import client from "honox/vite/client";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      build: {
        rollupOptions: {
          input: ["/app/client.ts", "/app/style.css"],
          output: {
            entryFileNames: "static/client.js",
            assetFileNames: "static/assets/[name].[ext]",
          },
        },
      },
      plugins: [client()],
    };
  } else {
    return {
      ssr: {
        external: ["react", "react-dom"],
      },
      plugins: [honox(), pages()],
    };
  }
});
