import { betterAuth } from "better-auth";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

export const getAuth = (dbInstance: D1Database) => {
  const dbConnection = new D1Dialect({ database: dbInstance });
  const db = new Kysely({
    dialect: dbConnection,
  });

  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.AUTH_SECRET,
    // NOTE:
    // 本当は以下のように drizzleAdapter を使いたい
    // database: drizzleAdapter(getDB(dbInstance), { provider: "sqlite" })
    //
    // けど、D1だとこんなエラーが出る
    // Error: D1_TYPE_ERROR: Type 'object' not supported for value '<日付>']
    //
    // 調査したところ、drizzleのアダプタがD1に対応できていないっぽかったのでKyseleyを使うようにしてる
    // 問題の内容的には、多分これが近いと思う
    // @see https://github.com/nextauthjs/next-auth/issues/8453
    database: {
      db,
      type: "sqlite",
    },
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
  });
};
