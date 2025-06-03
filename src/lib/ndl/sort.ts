import type { BookDetailWithoutId } from "@/types/book";

/**
 * 書籍をキーワードに基づいてソート
 * @param books - ソート対象の書籍配列
 * @param keyword - ソート基準となるキーワード
 * @returns ソートされた書籍配列
 */
export function sortBooksByKeyword(books: BookDetailWithoutId[], keyword: string): BookDetailWithoutId[] {
  return books.sort((a, b) => {
    // タイトルの包含率でソート
    const aTitleRate = calculateInclusionRate(a.title, keyword);
    const bTitleRate = calculateInclusionRate(b.title, keyword);

    if (aTitleRate !== bTitleRate) {
      return bTitleRate - aTitleRate;
    }

    // 著者名の包含率でソート
    if (a.authors && b.authors) {
      const aAuthorRate = calculateInclusionRate(a.authors.join(" "), keyword);
      const bAuthorRate = calculateInclusionRate(b.authors.join(" "), keyword);

      if (aAuthorRate !== bAuthorRate) {
        return bAuthorRate - aAuthorRate;
      }
    }

    // 出版社名の包含率でソート
    if (a.publishers && b.publishers) {
      const aPublisherRate = calculateInclusionRate(a.publishers.join(" "), keyword);
      const bPublisherRate = calculateInclusionRate(b.publishers.join(" "), keyword);

      if (aPublisherRate !== bPublisherRate) {
        return bPublisherRate - aPublisherRate;
      }
    }

    // すべての包含率が同じ場合はタイトルでソート
    const aTitle = a.title.match(/\d+/);
    const bTitle = b.title.match(/\d+/);

    // 数字が含まれている場合は数値でソート
    if (aTitle && bTitle) {
      return Number.parseInt(aTitle[0], 10) - Number.parseInt(bTitle[0], 10);
    }

    return a.title.localeCompare(b.title);
  });
}

/**
 * キーワードの包含率を計算
 * @param keyword - キーワード文字列
 * @param target - 対象文字列
 * @returns 包含率
 */
function calculateInclusionRate(keyword: string, target: string): number {
  const keywordList = keyword.toLowerCase().split(" ");
  let totalInclusionRate = 0;

  for (const keyword of keywordList) {
    const keywordChars = new Set(keyword);
    let matchedChars = 0;

    for (const char of target.toLowerCase()) {
      if (keywordChars.has(char)) {
        matchedChars++;
        keywordChars.delete(char);
      }
    }

    totalInclusionRate += matchedChars / keyword.length;
  }

  return totalInclusionRate / keywordList.length;
}
