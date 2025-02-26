"use server";

import { getAuth } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";

export const signOutWithRedirect = async () => {
  const { env } = getCloudflareContext();
  const auth = getAuth(env.DB);

  await auth.api.signOut({
    headers: await headers(),
  });
};
