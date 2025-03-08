import { getBooksPossiblyNewReleases } from "@/db/queries/book";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { NextRequest } from "next/server";

/**
 * 新刊書籍の書誌IDを返す
 */
export async function GET(req: NextRequest) {
  const accessKey = req.headers.get("X-API-SECRET-KEY");

  if (accessKey !== process.env.API_SECRET_KEY) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  const { env } = getCloudflareContext();

  // 登録済みの新刊の書誌データを取得
  const targetBooks = await getBooksPossiblyNewReleases(env.DB);
  const ids = targetBooks.map((book) => book.id);

  return new Response(JSON.stringify(ids), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
