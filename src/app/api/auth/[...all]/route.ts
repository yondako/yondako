import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { NextRequest } from "next/server";
import { getAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { env } = getCloudflareContext();
  const auth = getAuth(env.DB);

  return auth.handler(req);
}

export async function POST(req: NextRequest) {
  const { env } = getCloudflareContext();
  const auth = getAuth(env.DB);

  return auth.handler(req);
}
