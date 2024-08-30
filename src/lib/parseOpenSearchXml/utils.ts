/**
 * JP-eコードを取得
 * @param seeAlsoUrls URLの配列
 * @returns JP-eコード
 */
export function getJpeCode(seeAlsoUrls: string[]): string | undefined {
  // JP-eコードを取り出す
  // 対象のURL形式はこんな感じ
  // https://www.books.or.jp/book-details/<JP-eコード>
  const jpeCode = seeAlsoUrls
    .map((rawUrl) => {
      const { hostname, pathname } = new URL(rawUrl);

      if (hostname !== "www.books.or.jp") {
        return;
      }

      const paths = pathname.split("/");

      // JP-eコードは20ケタ
      return paths.find((path) => path.length === 20);
    })
    .filter((code) => typeof code === "string");

  return jpeCode.length <= 0 ? undefined : jpeCode[0];
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

  const authors = Array.isArray(rawAuthors) ? rawAuthors : [rawAuthors];

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

  return [...new Set(publishers.map((e) => e.trim()))];
}
