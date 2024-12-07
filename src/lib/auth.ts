import "server-only";

import db from "@/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema/user";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [github, google],
});
