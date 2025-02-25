import type { BookDetailWithoutId } from "@/types/book";
import type { NDC } from "@/types/ndc";
import { parseOpenSearchXml } from "./parse";
import { sortBooksByKeyword } from "./sort";

const API_BASE_URL = "https://iss.ndl.go.jp/api/opensearch";

export type SearchOptions = {
  count: number;
  index?: number;
  params: {
    /* すべての項目を対象に検索 */
    any?: string;
    /* NDC */
    ndc?: NDC;
    /* 開始出版年月日 */
    from?: string;
    /* 終了出版年月日 */
    until?: string;
    /* ISBN */
    isbn?: string;
  };
};

type OpenSearchResponse = {
  meta: {
    totalResults: number;
    startIndex: number;
    itemsPerPage: number;
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
  // NOTE: NDLサーチAPIの最大取得件数は500
  endpoint.searchParams.append("cnt", "500");

  // その他をクエリパラメータに追加
  for (const [key, value] of Object.entries(opts.params)) {
    endpoint.searchParams.append(key, value);
  }

  // データプロバイダの指定
  // (国立国会図書館蔵書, 国立国会図書館新着書誌情報, 国立国会図書館全国書誌情報, JPRO)
  endpoint.searchParams.append(
    "dpid",
    "iss-ndl-opac iss-ndl-opac-inprocess iss-ndl-opac-national jpro-book",
  );

  // メディアタイプの指定
  // (資料形態: 紙)
  endpoint.searchParams.append("mediatype", "booklet");

  try {
    const res = await fetch(endpoint, {
      next: {
        // 10分間キャッシュ
        revalidate: 10 * 60,
      },
    });

    const xml = await res.text();
    const rawBooks = parseOpenSearchXml(xml);

    const { params, index = 0, count } = opts;

    // いい感じにソート
    const sortedBooks =
      params.any && rawBooks.length > 0
        ? sortBooksByKeyword(rawBooks, params.any ?? "")
        : rawBooks;

    const books = sortedBooks.slice(index, index + count);

    return {
      meta: {
        totalResults: sortedBooks.length,
        startIndex: index,
        itemsPerPage: books.length,
      },
      books,
    };
  } catch (e) {
    console.error("[NDL]", e);
  }
}
