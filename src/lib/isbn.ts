/**
 * ISBNからハイフンを削除する
 * @param isbn ISBN
 * @returns ハイフンを削除したISBN
 */
export function normalizeIsbn(isbn: string | null | undefined): string | null | undefined {
  if (!isbn) return isbn;
  return isbn.replace(/-/g, "");
}
