import TinySegmenter from "tiny-segmenter";

export type FilterNGWordsResult = {
  /** NGワードを含まない安全な文字列 */
  safeStrings: string[];
  /** 除外された文字列 */
  filteredStrings: string[];
};

/**
 * NGワードチェックと間引きを行う関数
 * @param ngWords NGワードの配列
 * @param titles チェックする文字列の配列
 * @returns 結果
 */
export async function filterNGWords(
  ngWords: string[],
  titles: string[],
): Promise<FilterNGWordsResult> {
  const safeStrings: string[] = [];
  const filteredStrings: string[] = [];

  for (const title of titles) {
    const matched = containsNGWord(title, ngWords);

    if (matched.length > 0) {
      filteredStrings.push(title);
      continue;
    }

    safeStrings.push(title);
  }

  return { safeStrings, filteredStrings };
}

/**
 * 文字列にNGワードが含まれているか確認する関数
 * @param text 検査する文字列
 * @param ngWords NGワードリスト
 * @returns マッチしたNGワードの配列
 */
function containsNGWord(text: string, ngWords: string[]): string[] {
  const matchedWords: string[] = [];
  const normalizedText = text.toLowerCase();

  // 分かち書き
  const segmenter = new TinySegmenter();
  const segments = Array.from(segmenter.segment(text));

  // 極端に短い形態素は無視（助詞など）
  const words = segments.filter((word) => word.length >= 2);

  for (const ngWord of ngWords) {
    const ngWordLower = ngWord.toLowerCase();

    // 完全一致チェック
    if (words.some((pattern) => pattern.toLowerCase() === ngWordLower)) {
      matchedWords.push(ngWord);
      continue;
    }

    // 部分一致チェック（長いNGワードの場合）
    if (ngWord.length >= 4 && normalizedText.includes(ngWordLower)) {
      matchedWords.push(ngWord);
    }
  }

  return matchedWords;
}
