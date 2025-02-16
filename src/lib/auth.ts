import "server-only";

import { REDIRECT_TO_AUTH_ERROR } from "@/constants/redirect";
import db from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [github, google],
  pages: {
    signIn: "/",
    error: REDIRECT_TO_AUTH_ERROR,
  },
});
