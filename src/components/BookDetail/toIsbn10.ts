/**
 * ISBN-13 から ISBN-10 に変換する
 * @param rawIsbn13 ISBN-13
 * @returns ISBN-10
 */
export const toIsbn10 = (
  rawIsbn13: string | null | undefined,
): string | null => {
  if (!rawIsbn13) {
    return null;
  }

  const isbn = rawIsbn13.replace(/-/g, "");

  // ISBN-10 ならそのまま返す
  if (isbn.length === 10) {
    return isbn;
  }

  // ケタ数が違う場合は変換できない
  if (isbn.length !== 13) {
    return null;
  }

  const body = isbn.slice(3, 12);
  const nums = body.split("").map(Number);
  const sum = nums.reduce((acc, cur, i) => acc + cur * (10 - i), 0);

  let digit = (11 - (sum % 11)).toString();

  if (digit === "10") {
    digit = "X";
  } else if (digit === "11") {
    digit = "0";
  }

  return body + digit;
};
