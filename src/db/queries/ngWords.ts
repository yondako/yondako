import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDB } from "..";
import * as dbSchema from "../schema/book";

/**
 * NGワードの一覧を取得
 * NOTE: 24時間キャッシュされます
 * @param dbInstance D1のインスタンス
 * @returns NGワードの一覧
 */
export async function getAllNgWords(dbInstance: D1Database): Promise<string[]> {
  return unstable_cache(
    async () => {
      const db = getDB(dbInstance);

      const rawNgWords = await db.query.ngWords.findMany({
        where: eq(dbSchema.ngWords.isActive, true),
        columns: {
          word: true,
        },
      });

      return rawNgWords.map((ngWord) => ngWord.word);
    },
    ["ng-words"],
    {
      revalidate: 60 * 60 * 24, // 24時間
    },
  )();
}
