/**
 * 全角英数字を半角に変換
 * @param input 変換対象の文字列
 * @returns 半角に変換された文字列
 */
export function convertFullWidthToHalfWidth(input: string): string {
  return input.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
  });
}

/**
 * number型を含む値をstring or undefinedに変換
 * @param value 値
 * @returns 変換後
 */
export function toStringOrUndefined(
  value: string | number | undefined,
): string | undefined {
  return typeof value === "number" ? String(value) : value;
}

/**
 * JP-eコードを取得
 * @param seeAlsoUrls URLの配列
 * @returns JP-eコード
 */
export function getJpeCode(
  seeAlsoUrls: string[] | undefined,
): string | undefined {
  if (!seeAlsoUrls) {
    return;
  }

  const jpeUrlRegex =
    /^https:\/\/www\.books\.or\.jp\/book-details\/([a-zA-Z0-9]{20})$/;

  // JP-eコードを取り出す
  const jpeCode = seeAlsoUrls.find((url) => url && jpeUrlRegex.test(url));

  return jpeCode?.match(jpeUrlRegex)?.at(1);
}

/**
 * SeeAlsoからISBNを取得
 * @param seeAlsoUrls URLの配列
 * @returns ISBN
 */
export function getIsbnFromSeeAlso(
  seeAlsoUrls: string[] | undefined,
): string | undefined {
  if (!seeAlsoUrls) {
    return;
  }

  const isbnUrlRegex = /^https:\/\/www\.books\.or\.jp\/book-details\/(978\d+)$/;
  const isbn = seeAlsoUrls.find((url) => url && isbnUrlRegex.test(url));

  return isbn?.match(isbnUrlRegex)?.at(1);
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
    .map((author) => {
      const edited = author
        // yyyy-yyyy pub. (YYYY年) を消す
        .replace(/(, )?(\d{4}-(\d{0,4})?|pub. \d{4}|\(\d{4}年\))/, "")
        // 苗字と名前を区切っているカンマを消す
        .replace(", ", " ")
        .trim();

      return convertFullWidthToHalfWidth(edited);
    })
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

  const edited = publishers.map((publisher) => {
    return convertFullWidthToHalfWidth(publisher.trim());
  });

  return [...new Set(edited)];
}
