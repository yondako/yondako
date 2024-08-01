import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/*.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_PATH || "",
  },
});
