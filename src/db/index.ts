import { drizzle } from "drizzle-orm/d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

function getDB() {
  // 開発
  if (process.env.NODE_ENV === "development") {
    const { env } = getRequestContext();
    return drizzle(env.DB);
  }

  // 本番
  return drizzle((process.env as unknown as { DB: D1Database }).DB);
}

export default getDB();
