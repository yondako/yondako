export const thumbnailApiBaseUrl = "https://ndlsearch.ndl.go.jp/thumbnail";

/**
 * 書影画像のURLを作成
 * @param id JP-eコードもしくはISBN-13
 * @return URL
 */
export function createThumbnailUrl(id: string | undefined): string | undefined {
  return id ? `${thumbnailApiBaseUrl}/${id.replace(/-/g, "")}.jpg` : undefined;
}

/**
 * 著者名の配列を作成
 * @param authors カンマ区切りの著者名 or 著者名の配列
 * @return 著者名の配列
 */
export function createAuthors(
  rawAuthors: string | string[] | undefined,
): string[] | undefined {
  if (!rawAuthors) {
    return;
  }

  const authors = Array.isArray(rawAuthors)
    ? rawAuthors
    : rawAuthors.split(",");

  const results = authors
    .map((author) =>
      author
        // yyyy-yyyy pub. (YYYY年) を消す
        .replace(/(, )?(\d{4}-(\d{0,4})?|pub. \d{4}|\(\d{4}年\))/, "")
        // 苗字と名前を区切っているカンマを消す
        .replace(", ", " ")
        .trim(),
    )
    .filter((author) => author !== "");

  // 重複を排除
  return [...new Set(results)];
}

/**
 * 出版社の配列を作成
 * @param publishers カンマ区切りの出版社名 or 出版社名の配列
 * @return 出版社名の配列
 */
export function createPublishers(
  rawPublisher: string | string[] | undefined,
): string[] | undefined {
  if (!rawPublisher) {
    return;
  }

  const publishers = Array.isArray(rawPublisher)
    ? rawPublisher
    : rawPublisher.split(",");

  return [...new Set(publishers)];
}
