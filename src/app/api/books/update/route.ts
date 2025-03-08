import { MAX_UPDATE_BOOKS_PER_REQUEST } from "@/constants/update-books";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { NextRequest } from "next/server";
import { array, maxLength, object, pipe, safeParse, string } from "valibot";
import { updateNewReleaseBooks } from "./_libs/checkAndUpdateBook";

const requestBodySchema = object({
  ids: pipe(
    array(string()),
    maxLength(
      MAX_UPDATE_BOOKS_PER_REQUEST,
      "1回のリクエストで更新可能な書籍は20件までです",
    ),
  ),
});

/**
 * 新刊書誌データの更新を行う
 */
export async function POST(req: NextRequest) {
  const accessKey = req.headers.get("X-API-SECRET-KEY");

  if (accessKey !== process.env.API_SECRET_KEY) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  // リクエストBodyをパース
  const body = await req.json();
  const { success, output, issues } = safeParse(requestBodySchema, body);

  if (!success) {
    const error = {
      message: "Invalid request body",
      issues,
    };

    return new Response(JSON.stringify(error), {
      status: 400,
    });
  }

  const { ctx } = getCloudflareContext();

  ctx.waitUntil(updateNewReleaseBooks(output.ids));

  return new Response("OK", {
    status: 200,
  });
}
