import { BookInfo } from "@/types/book";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import * as dbSchema from "../schema/book";
import { createAuthor } from "./author";
import { createPublisher } from "./publisher";

/**
 * 書籍情報を取得
 * @param d1 D1Database
 * @param id 書籍ID
 * @returns 書籍情報
 */
export async function getBook(
  d1: D1Database,
  id: string,
): Promise<BookInfo | undefined> {
  const db = drizzle(d1, { schema: dbSchema });

  const bookInfo = await db.query.books.findFirst({
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

  if (!bookInfo) {
    return;
  }

  const { bookAuthors, bookPublishers, ...resultBookInfo } = bookInfo;

  return {
    ...resultBookInfo,
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
 * @param d1 D1Database
 * @param book 書籍情報
 */
export async function createBook(
  d1: D1Database,
  book: BookInfo,
): Promise<void> {
  const db = drizzle(d1, { schema: dbSchema });

  // 書籍情報を登録
  const { ndlBibId } = await db
    .insert(dbSchema.books)
    .values(book)
    .returning()
    .get();

  // 著者情報を登録
  if (book.authors) {
    for (const name of book.authors) {
      const id = await createAuthor(d1, name);

      await db
        .insert(dbSchema.bookAuthors)
        .values({ bookId: ndlBibId, authorId: id });
    }
  }

  // 出版社情報を登録
  if (book.publishers) {
    for (const name of book.publishers) {
      const id = await createPublisher(d1, name);

      await db
        .insert(dbSchema.bookPublishers)
        .values({ bookId: ndlBibId, publisherId: id });
    }
  }
}
