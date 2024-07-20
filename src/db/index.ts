import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "./schema/book";

function getDB() {
  // 開発
  if (process.env.NODE_ENV === "development") {
    const { env } = getRequestContext();

    return drizzle(env.DB, {
      schema: dbSchema,
    });
  }

  // 本番
  return drizzle((process.env as unknown as { DB: D1Database }).DB, {
    schema: dbSchema,
  });
}

export default getDB();
