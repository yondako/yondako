const RAKUTEN_API_ENDPOINT = "https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404";

type RakutenBooksResponse = {
  Items?: Array<{ largeImageUrl?: string }>;
};

/**
 * Rakuten Books APIから書影URLを取得
 * @param isbn ISBN（ハイフン付きでも可）
 * @param applicationId 楽天アプリケーションID
 * @param appSecret 楽天アプリケーションシークレット
 * @param originUrl Originヘッダーに設定するURL
 * @returns 書影URL（取得できない場合はnull）
 */
export async function fetchThumbnailUrl(
  isbn: string,
  applicationId: string,
  appSecret: string,
  originUrl: string,
): Promise<string | null> {
  const url = new URL(RAKUTEN_API_ENDPOINT);

  url.searchParams.set("applicationId", applicationId);
  url.searchParams.set("accessKey", appSecret);
  url.searchParams.set("isbn", isbn.replace(/-/g, ""));
  url.searchParams.set("formatVersion", "2");

  const res = await fetch(url, {
    headers: {
      Origin: originUrl, // これがないと403になる
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Rakuten API error response: ${errorText}`);
    throw new Error(`Rakuten API error: ${res.status}`);
  }

  const data: RakutenBooksResponse = await res.json();

  // 書籍が見つからない場合はItems: []が返るのでnull
  return data.Items?.[0]?.largeImageUrl ?? null;
}
