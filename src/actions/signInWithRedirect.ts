"use server";

import { REDIRECT_TO_AUTH_ERROR } from "@/constants/redirect";
import { getAuth } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";

export const signInWithRedirect = async (
  redirectUrl: string,
  formData: FormData,
) => {
  // TODO: 型チェックしたほうがいいかも
  const provider = formData.get("provider")?.toString() as "google" | "github";

  const { env } = getCloudflareContext();
  const auth = getAuth(env.DB);

  try {
    const a = await auth.api.signInSocial({
      body: {
        provider,
      },
      // redirectUrl,
    });

    console.log("signInWithRedirect", a);

    redirect(redirectUrl);
  } catch (error) {
    // 認証のエラーならエラーページにリダイレクト
    if (error instanceof APIError) {
      return redirect(REDIRECT_TO_AUTH_ERROR);
    }

    // それ以外のエラーはそのままthrow (Next.jsのリダイレクト等もここに流れる)
    throw error;
  }
};
