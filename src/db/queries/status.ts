import type { BookType, ReadingStatus } from "@/types/book";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "../schema/book";

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
): Promise<BookType[]> {
  const db = drizzle(d1, { schema: dbSchema });

  try {
    const raw = await db.query.readingStatuses.findMany({
      where: and(
        eq(dbSchema.readingStatuses.userId, userId),
        eq(dbSchema.readingStatuses.status, status),
      ),
      with: {
        book: {
          with: {
            bookAuthors: {
              with: {
                author: {
                  columns: {
                    name: true,
                  },
                },
              },
            },
            bookPublishers: {
              with: {
                publisher: {
                  columns: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return raw.map((r) => ({
      info: {
        ...r.book,
        authors:
          r.book.bookAuthors.length > 0
            ? r.book.bookAuthors
                .map(({ author }) => author?.name)
                .filter((x) => typeof x === "string")
            : undefined,
        publishers:
          r.book.bookPublishers.length > 0
            ? r.book.bookPublishers
                .map(({ publisher }) => publisher?.name)
                .filter((x) => typeof x === "string")
            : undefined,
      },
      readingStatus: r.status,
    }));
  } catch (e) {
    // TODO: エラーハンドリング
    console.log(e);
    return [];
  }
}
