import { BookStatus } from "@/types/book";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "../schema/status";

/**
 * 読書ステータスを追加
 * @param d1 D1Database
 * @param userId ユーザーID
 * @param bookId 書籍ID
 * @returns ステータス
 */
export async function upsertReadingStatus(
  d1: D1Database,
  userId: string,
  bookId: string,
  status: BookStatus,
): Promise<BookStatus> {
  const db = drizzle(d1, { schema: dbSchema });

  // ステータスを作成。存在する場合は更新
  const result = await db
    .insert(dbSchema.readingStatuses)
    .values({ userId, bookId, status })
    .onConflictDoUpdate({
      target: [
        dbSchema.readingStatuses.userId,
        dbSchema.readingStatuses.bookId,
      ],
      set: { status },
    })
    .returning()
    .get();

  return result.status;
}
