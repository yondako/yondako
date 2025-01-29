import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";
import { array, maxLength, object, pipe, safeParse, string } from "valibot";
import { updateNewReleaseBooks } from "./_libs/checkAndUpdateBook";

export const runtime = "edge";

const requestBodySchema = object({
  ids: pipe(array(string()), maxLength(10)),
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
  const { success, output } = safeParse(requestBodySchema, body);

  if (!success) {
    return new Response("Bad Request", {
      status: 400,
    });
  }

  const { ctx } = getRequestContext();

  ctx.waitUntil(updateNewReleaseBooks(output.ids));

  return new Response("OK", {
    status: 200,
  });
}
