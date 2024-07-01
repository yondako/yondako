import { ReadingStatus } from "@/types/book";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "../schema/book";
import { and, eq } from "drizzle-orm";

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
  status: ReadingStatus,
): Promise<ReadingStatus> {
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

/**
 * 読書ステータスから書籍を取得
 * @param d1 D1Database
 * @pqram userId ユーザーID
 * @param status ステータス
 * @returns 書籍
 */
export async function getBooksByReadingStatus(
  d1: D1Database,
  userId: string,
  status: ReadingStatus,
) {
  const db = drizzle(d1, { schema: dbSchema });

  try {
    const raw = await db.query.books.findMany({
      with: {
        readingStatuses: {
          where: and(
            eq(dbSchema.readingStatuses.userId, userId),
            eq(dbSchema.readingStatuses.status, status),
          ),
          columns: {
            status: true,
          },
        },
      },
    });
    console.log(raw);
  } catch (e) {
    console.log(e);
  }
}
