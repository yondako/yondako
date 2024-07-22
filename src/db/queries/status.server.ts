import type { BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import { and, asc, desc, eq } from "drizzle-orm";
import db from "..";
import * as dbSchema from "../schema/book";

/**
 * 読書ステータスを追加
 * @param userId ユーザーID
 * @param bookId 書籍ID
 * @returns ステータス
 */
export async function upsertReadingStatus(
  userId: string,
  bookId: string,
  status: ReadingStatus,
): Promise<ReadingStatus> {
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
 * @param order ソート順
 * @returns 書籍
 */
export async function getBooksByReadingStatus(
  userId: string,
  status: ReadingStatus,
  order: "asc" | "desc",
): Promise<BookType[]> {
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
      orderBy:
        order === "asc"
          ? asc(dbSchema.readingStatuses.createdAt)
          : desc(dbSchema.readingStatuses.createdAt),
    });

    return raw.map((r) => ({
      detail: {
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
