"use server";

import { createBook, getBook } from "@/db/queries/book";
import { upsertReadingStatus } from "@/db/queries/status";
import { auth } from "@/lib/auth";
import { searchBooksFromNDL } from "@/lib/ndl";
import type { BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";

type UpdateReadingStatusResult = {
  book?: BookType;
  error?: string;
};

/**
 * 読書ステータスを更新
 * @param bookId 書籍ID
 * @param status 読書ステータス
 * @returns 更新結果
 */
export async function updateReadingStatus(
  bookId: string,
  status: ReadingStatus,
): Promise<UpdateReadingStatusResult> {
  const session = await auth();

  if (!session || !session.user?.id) {
    return {
      error: "この操作にはログインが必要です",
    };
  }

  // Dbに登録されているか確認
  let bookDetail = await getBook(bookId);

  // DBに登録
  if (!bookDetail) {
    // NDLから書籍データを取得
    const results = await searchBooksFromNDL({
      any: bookId,
      cnt: 1,
    });

    if (
      !results ||
      results.books.length <= 0 ||
      results.books[0].ndlBibId !== bookId
    ) {
      return {
        error: "対象の書籍データを取得できませんでした",
      };
    }

    bookDetail = results.books[0];

    await createBook(bookDetail);
  }

  // ステータスの変更をDBに反映
  const resultReadingStatus = await upsertReadingStatus(
    session.user.id,
    bookDetail.ndlBibId,
    status,
  );

  return {
    book: {
      detail: bookDetail,
      readingStatus: resultReadingStatus,
    },
  };
}
