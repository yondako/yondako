import "server-only";

import type {
  BookDetail,
  BookDetailWithoutId,
  BookIdentifiers,
} from "@/types/book";
import { and, eq, isNotNull, isNull, or } from "drizzle-orm";
import db from "..";
import * as dbSchema from "../schema/book";
import { createAuthor } from "./author";
import { createPublisher } from "./publisher";

/**
 * 書籍データを取得
 * @param identifiers 書籍識別子
 * @returns 書籍データ
 */
export async function getBook({
  ndlBibId,
  isbn,
}: BookIdentifiers): Promise<BookDetail | undefined> {
  if (!ndlBibId && !isbn) {
    return;
  }

  // 新刊かどうか (JPROのデータなのでNDL書誌IDがない)
  const isNewRelease = !ndlBibId && isbn;

  const rawBook = await db.query.books.findFirst({
    where: isNewRelease
      ? // 新刊の場合はISBNで検索
        and(isNull(dbSchema.books.ndlBibId), eq(dbSchema.books.isbn, isbn))
      : // それ以外はNDL書誌IDかISBNで検索
        or(
          ndlBibId ? eq(dbSchema.books.ndlBibId, ndlBibId) : undefined,
          isbn ? eq(dbSchema.books.isbn, isbn) : undefined,
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
        ? bookAuthors
            .map(({ author }) => author?.name)
            .filter((x) => typeof x === "string")
        : undefined,
    publishers:
      bookPublishers.length > 0
        ? bookPublishers
            .map(({ publisher }) => publisher?.name)
            .filter((x) => typeof x === "string")
        : undefined,
  };
}

/**
 * 書籍データを登録
 * @param book 書籍データ
 * @returns 登録した書籍データ
 */
export async function createBook(
  book: BookDetailWithoutId,
): Promise<BookDetail> {
  // 書籍データを登録
  const insertedBook = await db
    .insert(dbSchema.books)
    .values(book)
    .returning()
    .get();

  // 著者情報と出版社情報を登録
  await insertAuthorsAndPublishers(
    insertedBook.id,
    book.authors,
    book.publishers,
  );

  return insertedBook;
}

/**
 * NDL書誌IDのない書籍データを更新
 * @param isbn ISBN
 * @param book 書籍データ
 */
export async function updateBooksMissingNdlBibId(
  isbn: string,
  book: BookDetailWithoutId,
): Promise<void> {
  const { id } = await db
    .update(dbSchema.books)
    .set(book)
    .where(and(isNull(dbSchema.books.ndlBibId), eq(dbSchema.books.isbn, isbn)))
    .returning()
    .get();

  // 著者情報と出版社情報を登録
  await insertAuthorsAndPublishers(id, book.authors, book.publishers);
}

/**
 * NDL書誌IDを持たない書籍データを取得
 */
export async function getBooksWithoutNdlBibId(): Promise<BookDetail[]> {
  return db.query.books.findMany({
    where: and(isNull(dbSchema.books.ndlBibId), isNotNull(dbSchema.books.isbn)),
  });
}

/**
 * 著者情報と出版社情報を登録
 * @param bookId 書籍ID
 * @param authors 著者名
 * @param publishers 出版社名
 */
async function insertAuthorsAndPublishers(
  bookId: string,
  authors: string[] | undefined,
  publishers: string[] | undefined,
): Promise<void> {
  // 著者情報を登録
  if (authors) {
    for (const name of authors) {
      const authorId = await createAuthor(name);
      await db.insert(dbSchema.bookAuthors).values({ bookId, authorId });
    }
  }

  // 出版社情報を登録
  if (publishers) {
    for (const name of publishers) {
      const publisherId = await createPublisher(name);
      await db.insert(dbSchema.bookPublishers).values({ bookId, publisherId });
    }
  }
}
