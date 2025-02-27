import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDB } from "../db";

export const getAuth = (dbInstance: D1Database) => {
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: drizzleAdapter(getDB(dbInstance), {
      provider: "sqlite",
    }),
    socialProviders: {
      github: {
        clientId: process.env.AUTH_GITHUB_ID || "",
        clientSecret: process.env.AUTH_GITHUB_SECRET || "",
      },
      google: {
        clientId: process.env.AUTH_GOOGLE_ID || "",
        clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
      },
    },
    session: {
      fields: {
        expiresAt: "expires",
        token: "sessionToken",
      },
    },
    account: {
      fields: {
        accountId: "providerAccountId",
        refreshToken: "refresh_token",
        accessToken: "access_token",
        accessTokenExpiresAt: "expires_at",
        idToken: "id_token",
        providerId: "provider",
      },
    },
  });
};

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: DrizzleAdapter(db),
//   providers: [github, google],
//   pages: {
//     signIn: "/",
//     error: REDIRECT_TO_AUTH_ERROR,
//   },
// });
