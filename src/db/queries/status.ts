import "server-only";

import type { BookDetailWithoutId, BookType } from "@/types/book";
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
  or,
  sql,
} from "drizzle-orm";
import db from "..";
import * as dbSchema from "../schema/book";

/**
 * 読書ステータスを追加または更新
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
  const escapedTitleKeyword = titleKeyword
    ? `%${titleKeyword?.replaceAll("%", "\\%").replaceAll("_", "//_")}%`
    : undefined;

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
            eq(dbSchema.readingStatuses.bookId, dbSchema.books.id),
            escapedTitleKeyword
              ? sql`${dbSchema.books.title} LIKE ${escapedTitleKeyword} ESCAPE '\\'`
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
          eq(results.book.id, dbSchema.bookAuthors.bookId),
        )
        .leftJoin(
          dbSchema.authors,
          eq(dbSchema.bookAuthors.authorId, dbSchema.authors.id),
        )
        .leftJoin(
          dbSchema.bookPublishers,
          eq(results.book.id, dbSchema.bookPublishers.bookId),
        )
        .leftJoin(
          dbSchema.publishers,
          eq(dbSchema.bookPublishers.publisherId, dbSchema.publishers.id),
        )
        .groupBy(results.book.id)
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
 * 該当する書籍のステータスを取得
 * @param userId ユーザーID
 * @param bookIdentifiers 書籍識別子のリスト
 * @returns 該当する書籍のステータスの配列
 */
export async function getStatusesByBookIds(
  userId: string,
  bookIdentifiers: BookDetailWithoutId[],
): Promise<BookType[]> {
  try {
    // NDL書誌ID
    const ndlBibIds = bookIdentifiers
      .map((b) => b.ndlBibId)
      .filter((id) => typeof id === "string");

    // ISBN
    const isbns = bookIdentifiers
      .filter((id) => !id.ndlBibId && id.isbn)
      .map((b) => b.isbn)
      .filter((id) => typeof id === "string");

    const bookIds = db.$with("book_ids").as(
      db
        .select({
          id: dbSchema.books.id,
          ndlBibId: dbSchema.books.ndlBibId,
          isbn: dbSchema.books.isbn,
        })
        .from(dbSchema.books)
        .where(
          or(
            inArray(dbSchema.books.ndlBibId, ndlBibIds),
            inArray(dbSchema.books.isbn, isbns),
          ),
        ),
    );

    const raw = await db
      .with(bookIds)
      .select({
        bookId: dbSchema.readingStatuses.bookId,
        ndlBibId: bookIds.ndlBibId,
        isbn: bookIds.isbn,
        status: dbSchema.readingStatuses.status,
      })
      .from(dbSchema.readingStatuses)
      .leftJoin(bookIds, eq(dbSchema.readingStatuses.bookId, bookIds.id))
      .where(
        and(
          eq(dbSchema.readingStatuses.userId, userId),
          or(
            inArray(bookIds.ndlBibId, ndlBibIds),
            inArray(bookIds.isbn, isbns),
          ),
        ),
      );

    const results = bookIdentifiers.map((b) => {
      const readingStatus: ReadingStatus =
        raw.find((r) => b.ndlBibId === r.ndlBibId || b.isbn === r.isbn)
          ?.status ?? "none";

      return {
        detail: b,
        readingStatus,
      };
    });

    return results;
  } catch (e) {
    console.error("getStatusesByBookIds", e);
    return [];
  }
}
