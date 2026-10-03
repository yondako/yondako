import { unstable_cache } from "next/cache";
import type { BookDetailWithoutId } from "@/types/book";
import type { NDC } from "@/types/ndc";
import type { SearchType } from "@/types/search";
import { filterSensitiveBooks } from "../filterSensitiveBooks";
import { isSameIsbn } from "../isbn";
import { parseOpenSearchXml } from "./parse";
import { sortBooksByKeyword } from "./sort";

const API_BASE_URL = "https://ndlsearch.ndl.go.jp/api/opensearch";

// NDLサーチは混雑時に一時的な429を返すため、少し待って再試行する
const MAX_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 1_000;
// 検索結果の表示をあまり待たせないよう、Retry-Afterが大きくても上限で打ち切る
const MAX_RETRY_DELAY_MS = 3_000;

export type SearchOptions = {
  /** 取得件数 */
  limit: number;
  /** ページ番号 */
  page?: number;
  /** センシティブな書籍を除外する */
  ignoreSensitive?: boolean;
  /** NGワードリスト */
  ngWords?: string[];
  params?: {
    /** すべての項目を対象に検索 */
    any?: string;
    /** タイトル */
    title?: string;
    /** 著者名 */
    creator?: string;
    /** NDC */
    ndc?: NDC;
    /** 開始出版年月日 */
    from?: string;
    /** 終了出版年月日 */
    until?: string;
    /** ISBN */
    isbn?: string;
  };
};

type OpenSearchResponse = {
  meta: {
    totalResults: number;
  };
  books: BookDetailWithoutId[];
};

/**
 * 国立国会図書館サーチ (OpenSearch) で書籍を検索
 * @param opts 検索オプション
 * @returns 検索結果 / エラーの場合はundefined
 */
export async function searchBooksFromNDL(
  opts: SearchOptions,
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> = global.fetch,
): Promise<OpenSearchResponse | undefined> {
  const endpoint = new URL(API_BASE_URL);

  // 取得件数の指定
  // NOTE: limitが1ではない場合は、NDLサーチAPIの最大取得件数の500件を指定
  endpoint.searchParams.append("cnt", opts.limit === 1 ? "1" : "500");

  // その他をクエリパラメータに追加
  if (opts.params) {
    for (const [key, value] of Object.entries(opts.params)) {
      if (value) {
        endpoint.searchParams.append(key, value);
      }
    }
  }

  // データプロバイダの指定
  // (国立国会図書館蔵書, 国立国会図書館新着書誌情報, 国立国会図書館全国書誌情報, JPRO)
  endpoint.searchParams.append("dpid", "iss-ndl-opac iss-ndl-opac-inprocess iss-ndl-opac-national jpro-book");

  // メディアタイプの指定
  endpoint.searchParams.append("mediatype", "books");

  try {
    const cacheKey = JSON.stringify({
      count: opts.limit,
      ignoreSensitive: opts.ignoreSensitive,
      params: opts.params,
    });

    const { params, page = 0, limit = 0, ignoreSensitive = false, ngWords = [] } = opts;

    // 30分間キャッシュする
    const sortedBooks = await unstable_cache(
      async () => {
        const res = await fetchWithRetry(fetch, endpoint);
        if (!res.ok) throw new Error(`NDL API: HTTP ${res.status}`);
        const xml = await res.text();

        let rawBooks = parseOpenSearchXml(xml);

        // センシティブな書籍を除外する
        if (ignoreSensitive) {
          const results = filterSensitiveBooks(ngWords, rawBooks);
          rawBooks = results.safeBooks;
        }

        const keyword = params?.any || params?.title || params?.creator || "";

        // 検索タイプを判定
        const searchType: SearchType = params?.any
          ? "any"
          : params?.title
            ? "title"
            : params?.creator
              ? "creator"
              : "title";

        // いい感じにソート
        const results = rawBooks.length > 1 ? sortBooksByKeyword(rawBooks, keyword, searchType) : rawBooks;

        return results;
      },
      [cacheKey],
      {
        revalidate: 60 * 30, // 30分
      },
    )();

    const index = page * limit;
    const books = sortedBooks.slice(index, index + limit);

    return {
      meta: {
        totalResults: sortedBooks.length,
      },
      books,
    };
  } catch (e) {
    console.error("[NDL]", e);
  }
}

// NOTE: ISBN検索は別の書籍の誤ったISBN(dcndl:ErrorISBN)にもヒットするため、1件目が目的の書籍とは限らない
const ISBN_SEARCH_LIMIT = 10;

/**
 * ISBNが一致する書籍を国立国会図書館サーチから取得
 * @param isbn ISBN
 * @returns 書籍 / 見つからない場合やエラーの場合はundefined
 */
export async function findBookByIsbn(
  isbn: string,
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> = global.fetch,
): Promise<BookDetailWithoutId | undefined> {
  const result = await searchBooksFromNDL({ limit: ISBN_SEARCH_LIMIT, params: { isbn } }, fetch);
  const matchedBooks = result?.books.filter((book) => isSameIsbn(book.isbn, isbn)) ?? [];

  // 同じISBNの書誌が複数ある場合は、NDL書誌IDを持つ国立国会図書館の書誌を優先する
  return matchedBooks.find((book) => book.ndlBibId) ?? matchedBooks.at(0);
}

async function fetchWithRetry(
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  endpoint: URL,
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(30_000) });
    if (res.status !== 429 || attempt >= MAX_RETRIES) return res;

    await new Promise((resolve) => setTimeout(resolve, getRetryDelayMs(res, attempt)));
  }
}

function getRetryDelayMs(res: Response, attempt: number): number {
  const header = res.headers.get("Retry-After");
  const retryAfter = header === null ? Number.NaN : Number(header);
  const delay =
    Number.isFinite(retryAfter) && retryAfter >= 0 ? retryAfter * 1_000 : DEFAULT_RETRY_DELAY_MS * 2 ** attempt;
  return Math.min(delay, MAX_RETRY_DELAY_MS);
}
