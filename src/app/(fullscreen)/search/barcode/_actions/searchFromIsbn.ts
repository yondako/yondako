"use server";

import { getStatusesByBookIds } from "#src/db/queries/status";
import { auth } from "#src/lib/auth";
import { searchBooksFromNDL } from "#src/lib/ndl/index";
import type { BookType } from "#src/types/book";
import type { ReadingStatus } from "#src/types/readingStatus";

export async function searchFromIsbn(
  isbn: string,
): Promise<BookType | undefined> {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  const result = await searchBooksFromNDL({
    cnt: 1,
    isbn,
  });

  if (!result?.books || result.books.length <= 0) {
    return;
  }

  // ライブラリを検索
  const libraryBook = await getStatusesByBookIds(session.user.id, result.books);

  // 自分の読書ステータス
  const readingStatus: ReadingStatus =
    libraryBook.length > 0 ? libraryBook[0].status : "none";

  return {
    detail: result.books[0],
    readingStatus,
  };
}
