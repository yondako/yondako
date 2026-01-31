const RAKUTEN_API_ENDPOINT = "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404";

type RakutenBooksResponse = {
  Items?: Array<{ largeImageUrl?: string }>;
};

/**
 * Rakuten Books APIから書影URLを取得
 * @param isbn ISBN（ハイフン付きでも可）
 * @param applicationId 楽天アプリケーションID
 * @returns 書影URL（取得できない場合はnull）
 */
export async function fetchThumbnailUrl(isbn: string, applicationId: string): Promise<string | null> {
  const url = new URL(RAKUTEN_API_ENDPOINT);
  url.searchParams.set("applicationId", applicationId);
  url.searchParams.set("isbn", isbn.replace(/-/g, ""));
  url.searchParams.set("formatVersion", "2");

  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }

  const data: RakutenBooksResponse = await res.json();
  return data.Items?.[0]?.largeImageUrl ?? null;
}
