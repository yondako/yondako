import { getRequestContext } from "@cloudflare/next-on-pages";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import * as userDBSchema from "../schema/user";
import { auth } from "@/lib/auth.server";

const userDB = (() => {
  // 開発
  if (process.env.NODE_ENV === "development") {
    const { env } = getRequestContext();

    return drizzle(env.DB, {
      schema: userDBSchema,
    });
  }

  // 本番
  return drizzle((process.env as unknown as { DB: D1Database }).DB, {
    schema: userDBSchema,
  });
})();

/**
 * ユーザーを削除
 * @returns エラーメッセージ
 */
export async function deleteUser(): Promise<string | undefined> {
  const session = await auth();

  if (!session || !session.user?.id) {
    return "ログインしてください";
  }

  try {
    await userDB
      .delete(userDBSchema.users)
      .where(eq(userDBSchema.users.id, session.user.id));
  } catch (e) {
    return "アカウントの削除に失敗しました";
  }
}
