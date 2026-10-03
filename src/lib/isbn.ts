/**
 * ISBNからハイフンを削除する
 * @param isbn ISBN
 * @returns ハイフンを削除したISBN
 */
export function normalizeIsbn(isbn: string | null | undefined): string | null | undefined {
  if (!isbn) return isbn;
  return isbn.replace(/-/g, "");
}

/**
 * ISBNをハイフン無しのISBN-13に揃える
 * @param isbn ISBN
 * @returns ISBN-13 / ISBNとして解釈できない場合はハイフンを削除しただけの値
 */
export function toIsbn13(isbn: string | null | undefined): string | null | undefined {
  const normalized = normalizeIsbn(isbn);
  if (!normalized || !/^\d{9}[\dX]$/i.test(normalized)) return normalized;

  // ISBN-10は先頭に978を付け、チェックディジットを計算し直すとISBN-13になる
  const body = `978${normalized.slice(0, 9)}`;
  const sum = [...body].reduce((acc, digit, i) => acc + Number(digit) * (i % 2 === 0 ? 1 : 3), 0);
  return `${body}${(10 - (sum % 10)) % 10}`;
}

/**
 * 2つのISBNが同じ書籍を指すか判定する
 * NOTE: 古い書誌はISBN-10、新しい書誌はISBN-13で登録されているため、表記を揃えて比較する
 * @param a ISBN
 * @param b ISBN
 * @returns 同じ書籍ならtrue
 */
export function isSameIsbn(a: string | null | undefined, b: string | null | undefined): boolean {
  const isbnA = toIsbn13(a);
  return !!isbnA && isbnA === toIsbn13(b);
}
