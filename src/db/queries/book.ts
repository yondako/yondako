import "server-only";

import type { BookDetail } from "@/types/book";
import { eq } from "drizzle-orm";
import db from "..";
import * as dbSchema from "../schema/book";
import { createAuthor } from "./author";
import { createPublisher } from "./publisher";

/**
 * 書籍情報を取得
 * @param id 書籍ID
 * @returns 書籍情報
 */
export async function getBook(id: string): Promise<BookDetail | undefined> {
  const rawBook = await db.query.books.findFirst({
    where: eq(dbSchema.books.ndlBibId, id),
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
 * 書籍情報を登録
 * @param book 書籍情報
 */
export async function createBook(book: BookDetail): Promise<void> {
  // 書籍情報を登録
  const { ndlBibId } = await db
    .insert(dbSchema.books)
    .values(book)
    .returning()
    .get();

  // 著者情報を登録
  if (book.authors) {
    for (const name of book.authors) {
      const id = await createAuthor(name);

      await db
        .insert(dbSchema.bookAuthors)
        .values({ bookId: ndlBibId, authorId: id });
    }
  }

  // 出版社情報を登録
  if (book.publishers) {
    for (const name of book.publishers) {
      const id = await createPublisher(name);

      await db
        .insert(dbSchema.bookPublishers)
        .values({ bookId: ndlBibId, publisherId: id });
    }
  }
}
