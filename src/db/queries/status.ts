import "server-only";

import type { BookDetail, BookType } from "@/types/book";
import type { Order } from "@/types/order";
import type { ReadingStatus } from "@/types/readingStatus";
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  like,
  sql,
} from "drizzle-orm";
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

export type searchBooksFromLibraryOptions = {
  userId: string;
  status: ReadingStatus;
  order: Order;
  /** 現在のページ */
  page: number;
  /** 1ページの件数 */
  pageSize: number;
  /** 絞り込み用キーワード (書籍のタイトルに含まれる文字列) */
  titleKeyword?: string;
};

type BookReadimgStatusResult = {
  books: BookType[];
  total: number;
};

/**
 * 条件からライブラリ内の書籍を検索
 * @params 検索条件
 * @returns 結果,総数
 */
export async function searchBooksFromLibrary({
  userId,
  status,
  order,
  page,
  pageSize,
  titleKeyword,
}: searchBooksFromLibraryOptions): Promise<BookReadimgStatusResult> {
  try {
    const results = db.$with("results").as(
      db
        .select({
          readingStatus: {
            ...getTableColumns(dbSchema.readingStatuses),
          },
          book: {
            ...getTableColumns(dbSchema.books),
          },
        })
        .from(dbSchema.readingStatuses)
        .where(
          and(
            eq(dbSchema.readingStatuses.userId, userId),
            eq(dbSchema.readingStatuses.status, status),
          ),
        )
        .innerJoin(
          dbSchema.books,
          and(
            eq(dbSchema.readingStatuses.bookId, dbSchema.books.ndlBibId),
            titleKeyword
              ? like(dbSchema.books.title, `%${titleKeyword}%`)
              : undefined,
          ),
        ),
    );

    const [total, raw] = await Promise.all([
      db.with(results).select({ count: count() }).from(results).get(),
      db
        .with(results)
        .select({
          readingStatus: {
            ...results.readingStatus,
          },
          book: {
            ...results.book,
          },
          authors: sql<
            string | null
          >`GROUP_CONCAT(DISTINCT ${dbSchema.authors.name})`,
          publishers: sql<
            string | null
          >`GROUP_CONCAT(DISTINCT ${dbSchema.publishers.name})`,
        })
        .from(results)
        .leftJoin(
          dbSchema.bookAuthors,
          eq(results.book.ndlBibId, dbSchema.bookAuthors.bookId),
        )
        .leftJoin(
          dbSchema.authors,
          eq(dbSchema.bookAuthors.authorId, dbSchema.authors.id),
        )
        .leftJoin(
          dbSchema.bookPublishers,
          eq(results.book.ndlBibId, dbSchema.bookPublishers.bookId),
        )
        .leftJoin(
          dbSchema.publishers,
          eq(dbSchema.bookPublishers.publisherId, dbSchema.publishers.id),
        )
        .groupBy(results.book.ndlBibId)
        .orderBy(
          order === "asc"
            ? asc(results.readingStatus.updatedAt)
            : desc(results.readingStatus.updatedAt),
        )
        .limit(pageSize)
        .offset(pageSize * (page - 1))
        .all(),
    ]);

    // 結果なし
    if (!total) {
      return { books: [], total: 0 };
    }

    const books: BookType[] = raw.map((r) => ({
      detail: {
        ...r.book,
        authors: r.authors ? r.authors.split(",") : undefined,
        publishers: r.publishers ? r.publishers?.split(",") : undefined,
      },
      readingStatus: r.readingStatus.status,
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
