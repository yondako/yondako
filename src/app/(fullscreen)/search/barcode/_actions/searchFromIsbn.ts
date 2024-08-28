"use server";

import { searchBooksFromNDL } from "@/lib/searchBooks";
import type { BookType } from "@/types/book";

export async function searchFromIsbn(
  isbn: string,
): Promise<BookType | undefined> {
  // const session = await auth();
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

  // const readingStatus = await getStatusesByBookIds(
  //   session.user.id,
  //   result.books,
  // );

  const readingStatus = "none";

  return {
    detail: result.books[0],
    readingStatus,
  };
}
