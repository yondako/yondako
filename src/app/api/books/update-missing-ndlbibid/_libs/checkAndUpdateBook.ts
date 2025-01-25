import {
  getBooksPossiblyNewReleases,
  incrementBooksUpdateCheckCount,
  updateBooksMissingNdlBibId,
} from "@/db/queries/book";
import { searchBooksFromNDL } from "@/lib/ndl";
import type { BookDetail } from "@/types/book";
import pLimit from "p-limit";

/**
 * 新刊書籍の更新確認を行う
 */
export async function updateNewReleaseBooks() {
  // 並列処理数は5件まで
  const limit = pLimit(5);

  // 登録済みの新刊の書誌データを取得
  const targetBooks = await getBooksPossiblyNewReleases();

  console.log(`Target books: ${targetBooks.length}`);

  // 書籍の更新確認
  const tasks = targetBooks.map(({ id, isbn }) =>
    limit(async () => {
      return await checkAndUpdateBook(id, isbn);
    }),
  );

  const results = await Promise.allSettled(tasks);

  // 未更新の書籍のIDを取得
  const unupdatedBookIds = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value)
    .filter((value) => typeof value === "string");

  console.log("[DONE]", `Unupdated books: ${unupdatedBookIds.length}`);

  // 更新確認回数をインクリメント
  await incrementBooksUpdateCheckCount(unupdatedBookIds);
}

/**
 * 書籍の更新確認を行い、更新がなかった書籍のIDを返す
 * @param bookId 書籍ID
 * @param isbn ISBN
 * @returns 更新がなかったら書籍ID、あったらnull
 */
async function checkAndUpdateBook(
  bookId: BookDetail["id"],
  isbn: BookDetail["isbn"],
): Promise<string | null> {
  if (!isbn) {
    return bookId;
  }

  const result = await searchBooksFromNDL({
    cnt: 1,
    isbn,
  });

  const resultBook = result?.books?.at(0);

  // NDL書誌IDが取得できなかった、またはISBNが一致しない場合はスキップ
  if (!resultBook || !resultBook.ndlBibId || resultBook.isbn !== isbn) {
    return bookId;
  }

  await updateBooksMissingNdlBibId(isbn, resultBook);

  console.log(`Updated book: ${resultBook.title}`);
  return null;
}
