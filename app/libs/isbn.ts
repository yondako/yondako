/**
 * ISBN-13 から ISBN-10 に変換する
 * @param rawIsbn13 ISBN-13
 * @returns ISBN-10
 */
export const toIsbn10 = (rawIsbn13: string): string => {
  const body = rawIsbn13.replace(/-/g, "").slice(3, 12);
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
