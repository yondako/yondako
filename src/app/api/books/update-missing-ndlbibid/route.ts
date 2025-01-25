import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";
import { updateNewReleaseBooks } from "./_libs/checkAndUpdateBook";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const accessKey = req.headers.get("X-API-SECRET-KEY");

  if (accessKey !== process.env.API_SECRET_KEY) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  const { ctx } = getRequestContext();

  ctx.waitUntil(updateNewReleaseBooks());

  return new Response("OK", {
    status: 200,
  });
}
