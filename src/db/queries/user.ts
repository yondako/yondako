import { getAuth } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getDB } from "..";
import * as userDBSchema from "../schema/user";

/**
 * ユーザーを削除
 * @param dbInstance D1のインスタンス
 * @returns エラーメッセージ
 */
export async function deleteUser(
  dbInstance: D1Database,
): Promise<string | undefined> {
  const { env } = getCloudflareContext();
  const auth = getAuth(env.DB);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    return "ログインしてください";
  }

  const userDB = getDB(dbInstance);

  try {
    await userDB
      .delete(userDBSchema.user)
      .where(eq(userDBSchema.user.id, session.user.id));
  } catch (e) {
    return "アカウントの削除に失敗しました";
  }
}
