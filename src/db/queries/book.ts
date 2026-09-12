import { and, eq, inArray, isNotNull, isNull, lt, or, sql } from "drizzle-orm";
import { MAX_UPDATE_CHECK_COUNT } from "@/constants/db";
import { normalizeIsbn } from "@/lib/isbn";
import type { BookDetail, BookDetailWithoutId, BookIdentifiers } from "@/types/book";
import { getDB } from "..";
import * as dbSchema from "../schema/book";

/**
 * 識別子から書籍データを取得
 * @param dbInstance D1のインスタンス
 * @param identifiers 書籍識別子
 * @returns 書籍データ
 */
export async function fetchBook(
  dbInstance: D1Database,
  { ndlBibId, isbn }: BookIdentifiers,
): Promise<BookDetail | undefined> {
  if (!ndlBibId && !isbn) {
    return;
  }

  const db = getDB(dbInstance);

  // 新刊かどうか (JPROのデータなのでNDL書誌IDがない)
  const isNewRelease = !ndlBibId && isbn;

  const rawBook = await db.query.books.findFirst({
    where: isNewRelease
      ? // 新刊の場合はISBNで検索
        and(isNull(dbSchema.books.ndlBibId), eq(dbSchema.books.isbn, isbn))
      : // それ以外はNDL書誌IDかISBNで検索
        or(
          ndlBibId ? eq(dbSchema.books.ndlBibId, ndlBibId) : undefined,
          isbn
            ? eq(
                // NOTE: JPRO提供のデータはハイフンがないが、NDL提供のデータはハイフンがあるため
                sql`replace(${dbSchema.books.isbn}, '-', '')`,
                normalizeIsbn(isbn),
              )
            : undefined,
        ),
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
  });

  // 書籍データが存在しない
  if (!rawBook) {
    return;
  }

  const { bookAuthors, bookPublishers, ...bookDetail } = rawBook;

  return {
    ...bookDetail,
    authors:
      bookAuthors.length > 0
        ? bookAuthors.map(({ author }) => author?.name).filter((x) => typeof x === "string")
        : undefined,
    publishers:
      bookPublishers.length > 0
        ? bookPublishers.map(({ publisher }) => publisher?.name).filter((x) => typeof x === "string")
        : undefined,
  };
}

/**
 * 書籍IDから書籍データを取得 (著者・出版社情報を含まない)
 * @param dbInstance D1のインスタンス
 * @param bookIds 書籍IDの配列
 * @returns 書籍データ
 */
export async function fetchSimpleBooksByIds(
  dbInstance: D1Database,
  bookIds: string[],
): Promise<Omit<BookDetail, "authors" | "publisher">[]> {
  if (bookIds.length === 0) {
    return [];
  }

  const db = getDB(dbInstance);

  return db.query.books.findMany({
    where: inArray(dbSchema.books.id, bookIds),
  });
}

type CreateBookOptions = {
  thumbnailQueue?: Queue<ThumbnailJobMessage>;
};

/**
 * 書籍データを登録
 * @param dbInstance D1のインスタンス
 * @param book 書籍データ
 * @param options オプション（書影取得用のQueue等）
 * @returns 登録した書籍データ
 */
export async function createBook(
  dbInstance: D1Database,
  book: BookDetailWithoutId,
  options?: CreateBookOptions,
): Promise<BookDetail> {
  const db = getDB(dbInstance);

  // 書籍データを登録
  const insertedBook = await db.insert(dbSchema.books).values(book).returning().get();

  // 著者情報と出版社情報を登録
  await insertAuthorsAndPublishers(dbInstance, insertedBook.id, book.authors, book.publishers);

  // 書影取得用のQueueにジョブを追加（ISBNがある場合のみ）
  if (options?.thumbnailQueue && insertedBook.isbn) {
    await options.thumbnailQueue.send({
      bookId: insertedBook.id,
      isbn: insertedBook.isbn,
    });
  }

  return insertedBook;
}

/**
 * 更新確認のカウントを加算
 * @param dbInstance D1のインスタンス
 * @param bookIds 書籍IDの配列
 */
export async function incrementBooksUpdateCheckCount(dbInstance: D1Database, bookIds: string[]): Promise<void> {
  const db = getDB(dbInstance);

  await db
    .update(dbSchema.books)
    .set({
      updateCheckCount: sql`${dbSchema.books.updateCheckCount} + 1`,
    })
    .where(inArray(dbSchema.books.id, bookIds))
    .execute();
}

/**
 * NDL書誌IDのない書籍データを更新
 * @param dbInstance D1のインスタンス
 * @param isbn ISBN
 * @param book 書籍データ
 */
export async function updateBooksMissingNdlBibId(
  dbInstance: D1Database,
  isbn: string,
  book: BookDetailWithoutId,
): Promise<void> {
  const db = getDB(dbInstance);

  const { id } = await db
    .update(dbSchema.books)
    .set(book)
    .where(and(isNull(dbSchema.books.ndlBibId), eq(dbSchema.books.isbn, isbn)))
    .returning()
    .get();

  // 著者情報と出版社情報を登録
  await insertAuthorsAndPublishers(dbInstance, id, book.authors, book.publishers);
}

/**
 * 新刊っぽい書籍データを取得
 * @param dbInstance D1のインスタンス
 * @returns 書籍データ
 */
export async function getBooksPossiblyNewReleases(dbInstance: D1Database): Promise<BookDetail[]> {
  const db = getDB(dbInstance);

  return db.query.books.findMany({
    // NDL書誌IDがない && ISBNがある && データの更新確認がしきい値未満のものを新刊とみなす
    where: and(
      isNull(dbSchema.books.ndlBibId),
      isNotNull(dbSchema.books.isbn),
      lt(dbSchema.books.updateCheckCount, MAX_UPDATE_CHECK_COUNT),
    ),
  });
}

/**
 * 著者情報と出版社情報を登録
 * @param dbInstance D1のインスタンス
 * @param bookId 書籍ID
 * @param authors 著者名
 * @param publishers 出版社名
 */
async function insertAuthorsAndPublishers(
  dbInstance: D1Database,
  bookId: string,
  authors: string[] = [],
  publishers: string[] = [],
): Promise<void> {
  const db = getDB(dbInstance);
  // D1の上限100パラメータを、紐付け1件につき書籍IDと名前の2個で使うため
  const batchSize = 50;

  for (let i = 0; i < authors.length; i += batchSize) {
    const names = authors.slice(i, i + batchSize);
    await db
      .insert(dbSchema.authors)
      .values(names.map((name) => ({ name })))
      .onConflictDoNothing({ target: dbSchema.authors.name });

    await db.insert(dbSchema.bookAuthors).values(
      names.map((name) => ({
        bookId,
        // 既存の著者も同じINSERT内で解決し、ID取得の往復を省く
        authorId: sql`(${db.select({ id: dbSchema.authors.id }).from(dbSchema.authors).where(eq(dbSchema.authors.name, name))})`,
      })),
    );
  }

  for (let i = 0; i < publishers.length; i += batchSize) {
    const names = publishers.slice(i, i + batchSize);
    await db
      .insert(dbSchema.publishers)
      .values(names.map((name) => ({ name })))
      .onConflictDoNothing({ target: dbSchema.publishers.name });

    await db.insert(dbSchema.bookPublishers).values(
      names.map((name) => ({
        bookId,
        publisherId: sql`(${db.select({ id: dbSchema.publishers.id }).from(dbSchema.publishers).where(eq(dbSchema.publishers.name, name))})`,
      })),
    );
  }
}
