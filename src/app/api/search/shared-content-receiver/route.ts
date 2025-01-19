import { extractBookTitle, fetchSiteTitle } from "@/lib/sharedContent";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const url = params.get("url");
  const rawText = params.get("text") || params.get("title");

  if (url) {
    const siteTitle = await fetchSiteTitle(url);
    const query = extractBookTitle(siteTitle);
    return redirect(createRedirectPath(query));
  }

  if (rawText) {
    const query = extractBookTitle(rawText);
    return redirect(createRedirectPath(query));
  }

  return new Response("Bad Request", {
    status: 400,
  });
}

function createRedirectPath(query: string | null): string {
  return query ? `/search/?q=${encodeURIComponent(query)}` : "/search/";
}
