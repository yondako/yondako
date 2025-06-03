import type { BookDetailWithoutId } from "@/types/book";
import TinySegmenter from "tiny-segmenter";

export type FilterNGWordsResult = {
  safeBooks: BookDetailWithoutId[];
  filteredBooks: BookDetailWithoutId[];
};

/**
 * センシティブな書籍をフィルタリング
 * @param ngWords NGワードの配列
 * @param books 書籍データの配列
 * @returns 結果
 */
export function filterSensitiveBooks(ngWords: string[], books: BookDetailWithoutId[]): FilterNGWordsResult {
  const safeBooks: BookDetailWithoutId[] = [];
  const filteredBooks: BookDetailWithoutId[] = [];

  for (const book of books) {
    const matched = containsNGWord(book.title, ngWords);

    if (matched.length > 0) {
      filteredBooks.push(book);
      continue;
    }

    safeBooks.push(book);
  }

  return { safeBooks, filteredBooks };
}

/**
 * 文字列にNGワードが含まれているか確認する関数
 * @param text 検査する文字列
 * @param ngWords NGワードリスト
 * @returns マッチしたNGワードの配列
 */
function containsNGWord(text: string, ngWords: string[]): string[] {
  const matchedWords: string[] = [];

  // 分かち書き
  const segmenter = new TinySegmenter();
  const segments = Array.from(segmenter.segment(text));

  // 極端に短い形態素は無視（助詞など）
  const words = segments.filter((word) => word.length >= 2);

  for (const word of words) {
    const wordLower = word.toLowerCase();

    // 完全一致チェック
    if (ngWords.some((ngWord) => ngWord.toLowerCase() === wordLower)) {
      matchedWords.push(word);
      continue;
    }

    // 分割された形態素が長い場合、部分一致でチェック
    if (word.length >= 4 && ngWords.some((ngWord) => wordLower.includes(ngWord.toLowerCase()))) {
      matchedWords.push(word);
    }
  }

  return matchedWords;
}
