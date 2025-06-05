import type { BookDetailWithoutId } from "@/types/book";
import { DEFAULT_SEARCH_TYPE, type SearchType } from "@/types/search";

/**
 * 書籍をキーワードに基づいてソート
 * @param books ソート対象の書籍配列
 * @param keyword キーワード
 * @param searchType 検索タイプ
 * @returns ソートされた書籍配列
 */
export function sortBooksByKeyword(
  books: BookDetailWithoutId[],
  keyword: string,
  searchType: SearchType = DEFAULT_SEARCH_TYPE,
): BookDetailWithoutId[] {
  return books.sort((a, b) => {
    // 包含率を比較
    const compareByInclusionRate = (aValue: string, bValue: string): number => {
      const aRate = calculateInclusionRate(aValue, keyword);
      const bRate = calculateInclusionRate(bValue, keyword);
      return aRate !== bRate ? bRate - aRate : 0;
    };

    // 検索タイプごとの比較順序を定義
    const comparisons: Array<() => number> = [];

    if (searchType === "title") {
      // タイトル検索: タイトルのみ比較
      comparisons.push(() => compareByInclusionRate(a.title, b.title));
    } else if (searchType === "creator") {
      // 著者検索: 著者 → タイトルの順で比較
      comparisons.push(() => {
        if (a.authors && b.authors) {
          return compareByInclusionRate(a.authors.join(" "), b.authors.join(" "));
        }

        return 0;
      });
      comparisons.push(() => compareByInclusionRate(a.title, b.title));
    } else {
      // "any": タイトル → 著者 → 出版社
      comparisons.push(() => compareByInclusionRate(a.title, b.title));

      comparisons.push(() => {
        if (a.authors && b.authors) {
          return compareByInclusionRate(a.authors.join(" "), b.authors.join(" "));
        }

        return 0;
      });

      comparisons.push(() => {
        if (a.publishers && b.publishers) {
          return compareByInclusionRate(a.publishers.join(" "), b.publishers.join(" "));
        }

        return 0;
      });
    }

    // 定義された順序で比較を実行
    for (const compare of comparisons) {
      const result = compare();
      if (result !== 0) return result;
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
