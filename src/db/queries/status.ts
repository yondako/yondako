import "server-only";

import type { BookDetail, BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
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

type BookReadimgStatusResult = {
  books: BookType[];
  total: number;
};

/**
 * 読書ステータスから書籍を取得
 * @pqram userId ユーザーID
 * @param status ステータス
 * @param order ソート順
 * @param page ページ
 * @param pageSize 取得件数
 * @returns 書籍, 総数
 */
export async function getBooksByReadingStatus(
  userId: string,
  status: ReadingStatus,
  order: "asc" | "desc",
  page: number,
  pageSize = 25,
): Promise<BookReadimgStatusResult> {
  try {
    const [total, raw] = await Promise.all([
      db
        .select({ count: count() })
        .from(dbSchema.readingStatuses)
        .where(
          and(
            eq(dbSchema.readingStatuses.userId, userId),
            eq(dbSchema.readingStatuses.status, status),
          ),
        )
        .get(),
      db.query.readingStatuses.findMany({
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
            ? asc(dbSchema.readingStatuses.updatedAt)
            : desc(dbSchema.readingStatuses.updatedAt),
        limit: pageSize,
        offset: pageSize * (page - 1),
      }),
    ]);

    if (!total) {
      return { books: [], total: 0 };
    }

    const books = raw.map((r) => ({
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

    return { books, total: total.count };
  } catch (e) {
    // TODO: エラーハンドリング
    console.error(e);
    return { books: [], total: 0 };
  }
}

/**
 * BookDetailのリストから該当する書籍のステータスを取得
 * @param userId ユーザーID
 * @param bookDetails 書籍詳細のリスト
 * @returns 該当する書籍のステータスの配列
 */
export async function getStatusesByBookIds(
  userId: string,
  bookDetails: BookDetail[],
) {
  const bookIds = bookDetails.map((b) => b.ndlBibId);

  const raw = await db.query.readingStatuses.findMany({
    where: and(
      eq(dbSchema.readingStatuses.userId, userId),
      inArray(dbSchema.readingStatuses.bookId, bookIds),
    ),
    columns: {
      bookId: true,
      status: true,
    },
  });

  return raw;
}
