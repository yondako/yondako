import fs from "node:fs";
import pages from "@hono/vite-cloudflare-pages";
import adapter from "@hono/vite-dev-server/cloudflare";
import honox from "honox/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      build: {
        rollupOptions: {
          input: ["./app/client.ts", "./app/style.css"],
          output: {
            entryFileNames: "static/client.js",
            chunkFileNames: "static/assets/[name]-[hash].js",
            assetFileNames: "static/assets/[name].[ext]",
          },
          plugins: [tsconfigPaths()],
        },
        emptyOutDir: false,
      },
      plugins: [tsconfigPaths()],
    };
  }

  return {
    server: {
      host: "local.yondako.com",
      port: 3000,
      https: {
        key: fs.readFileSync("./certificates/local.yondako.com.key"),
        cert: fs.readFileSync("./certificates/local.yondako.com.crt"),
      },
    },
    ssr: {
      external: ["react", "react-dom"],
    },
    plugins: [
      honox({
        devServer: { adapter },
      }),
      pages(),
      tsconfigPaths(),
    ],
  };
});
