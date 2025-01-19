import { extractBookTitle } from "@/lib/sharedContent";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const rawText = params.get("text") || params.get("title");

  if (!rawText) {
    return new Response("Bad Request", {
      status: 400,
    });
  }

  const query = extractBookTitle(rawText);
  return redirect(createRedirectPath(query));
}

function createRedirectPath(query: string | null): string {
  return query ? `/search/?q=${encodeURIComponent(query)}` : "/search/";
}
