/**
 * 共有されたテキストから書籍のタイトルっぽいものを抽出する
 * @param rawText 共有されたテキスト
 * @returns 書籍のタイトル
 */
export function extractBookTitle(rawText: string | null): string | null {
  if (!rawText) {
    return null;
  }

  // URLを除去
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  const text = rawText.replace(urlRegex, "").trim();

  // 書籍タイトル (出版社) の形式ではじまることを想定
  // (Amazonの共有リンクなど)
  const regex = /^(.+?)(?:\s*[-（(]|$)/;
  const match = text.match(regex);

  // 分割できなかった場合はそのまま返す
  return match?.at(1)?.replace(/\s/, " ").trim() ?? text;
}

/**
 * URLからWebサイトのタイトルを取得する
 * @param url URL
 * @returns OGPのタイトル
 */
export async function fetchSiteTitle(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  // URLが不正ならnullを返す
  if (!URL.canParse(url)) {
    return null;
  }

  try {
    const htmlResponse = await fetch(url, {
      headers: {
        "User-Agent": "bot",
        Accept: "text/html",
        "Accept-Language": "ja",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!htmlResponse.ok) {
      throw new Error(`${htmlResponse.status} ${htmlResponse.statusText}`);
    }

    const html = await htmlResponse.text();

    // タイトルを抽出
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    console.log("title:", titleMatch?.[1]);

    if (titleMatch?.[1]) {
      return titleMatch[1];
    }

    return null;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("[fetchSiteTitle] リクエストがタイムアウト", url);
    } else {
      console.error("[fetchSiteTitle] サイトタイトルの取得に失敗", url, error);
    }

    return null;
  }
}
