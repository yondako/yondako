"use server";

import { REDIRECT_TO_AUTH_ERROR } from "@/constants/redirect";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const signInWithRedirect = async (
  redirectUrl: string,
  formData: FormData,
) => {
  const provider = formData.get("provider")?.toString();

  try {
    await signIn(provider, {
      redirectTo: redirectUrl,
    });
  } catch (error) {
    // 認証のエラーならエラーページにリダイレクト
    if (error instanceof AuthError) {
      return redirect(REDIRECT_TO_AUTH_ERROR);
    }

    // それ以外のエラーはそのままthrow (Next.jsのリダイレクト等もここに流れる)
    throw error;
  }
};
