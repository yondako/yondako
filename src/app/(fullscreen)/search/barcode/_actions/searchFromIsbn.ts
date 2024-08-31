"use server";

import { getStatusesByBookIds } from "@/db/queries/status";
import { auth } from "@/lib/auth";
import { searchBooksFromNDL } from "@/lib/searchBooks";
import type { BookType } from "@/types/book";

export async function searchFromIsbn(
  isbn: string,
): Promise<BookType | undefined> {
  // const session = await auth();
  //
  // if (!session?.user?.id) {
  //   return;
  // }

  const result = await searchBooksFromNDL({
    cnt: 1,
    isbn,
  });

  if (!result?.books || result.books.length <= 0) {
    return;
  }

  // const libraryBook = await getStatusesByBookIds(session.user.id, result.books);
  //
  // if (libraryBook.length <= 0) {
  //   return;
  // }

  return {
    detail: result.books[0],
    // readingStatus: libraryBook[0].status,
    readingStatus: "none",
  };
}
