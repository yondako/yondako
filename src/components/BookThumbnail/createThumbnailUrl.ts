export const thumbnailApiBaseUrl = "https://ndlsearch.ndl.go.jp/thumbnail";

/**
 * 書影画像のURLを作成
 * @param id JP-eコードもしくはISBN-13
 * @return URL
 */
export function createThumbnailUrl(id: string): string {
  return `${thumbnailApiBaseUrl}/${id.replace(/-/g, "")}.jpg`;
}
