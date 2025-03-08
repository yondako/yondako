import { getAuth } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { NextRequest } from "next/server";

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
