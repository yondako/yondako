/**
 * 共有されたテキストから書籍のタイトルっぽいものを抽出する
 * @param text 共有されたテキスト
 * @returns 書籍のタイトル
 */
export function extractBookTitle(text: string | null): string | null {
  if (!text) {
    return null;
  }

  // 書籍タイトル (出版社) の形式ではじまることを想定
  // (Amazonの共有リンクなど)
  const regex = /^(.+?)(?:\s*[-（(]|$)/;
  const match = text.match(regex);

  // 分割できなかった場合はそのまま返す
  return match ? match[1].replace(/\s/, " ").trim() : text;
}

/**
 * URLからWebサイトのタイトルを取得する
 * @param url URL
 * @returns OGPのタイトル
 */
export async function fetchSiteTitle(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const htmlResponse = await fetch(url, {
      headers: {
        "User-Agent": "bot",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
