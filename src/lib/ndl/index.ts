import type { BookDetailWithoutId } from "@/types/book";
import type { NDC } from "@/types/ndc";
import type { SearchType } from "@/types/search";
import { unstable_cache } from "next/cache";
import { filterSensitiveBooks } from "../filterSensitiveBooks";
import { parseOpenSearchXml } from "./parse";
import { sortBooksByKeyword } from "./sort";

const API_BASE_URL = "https://iss.ndl.go.jp/api/opensearch";

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
  fetch = global.fetch,
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
        const res = await fetch(endpoint);
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
