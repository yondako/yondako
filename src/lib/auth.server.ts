import db from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [github, google],
});

/**
 * ログインページへのパスを生成する
 * @param callbackUrl ログイン後にリダイレクトするURL
 * @returns ログインページへのパス
 */
export const createSignInPath = (callbackUrl: string) =>
  `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
