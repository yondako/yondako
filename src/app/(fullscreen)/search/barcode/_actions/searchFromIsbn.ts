"use server";

import { getStatusesByBookIds } from "@/db/queries/status";
import { auth } from "@/lib/auth";
import { searchBooksFromNDL } from "@/lib/ndl";
import type { BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";

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
    libraryBook.at(0)?.readingStatus ?? "none";

  return {
    detail: result.books[0],
    readingStatus,
  };
}
