import { parseOpenSearchXml } from "./parse";

const apiBaseUrl = "https://iss.ndl.go.jp/api/opensearch";

export type SearchOptions = {
  /* 取得件数 */
  cnt: number;
  /* すべての項目を対象に検索 */
  any?: string;
  /* 開始出版年月日 */
  from?: string;
  /* 終了出版年月日 */
  until?: string;
  /* 取得開始位置 */
  idx?: number;
  /* ISBN */
  isbn?: string;
};

/**
 * 国立国会図書館サーチ (OpenSearch) で書籍を検索
 * @param opts 検索オプション
 * @returns 検索結果 / エラーの場合はundefined
 */
export async function searchBooksFromNDL(
  opts: SearchOptions,
  fetch = global.fetch,
) {
  const endpoint = new URL(apiBaseUrl);

  for (const [key, value] of Object.entries(opts)) {
    endpoint.searchParams.append(
      key,
      typeof value === "number" ? value.toString() : value,
    );
  }

  // データプロバイダの指定
  // (国立国会図書館蔵書, 国立国会図書館新着書誌情報, 国立国会図書館全国書誌情報, JPRO)
  endpoint.searchParams.append(
    "dpid",
    "iss-ndl-opac iss-ndl-opac-inprocess iss-ndl-opac-national jpro-book jpro-online",
  );

  // 対象を図書に絞る
  endpoint.searchParams.append("mediatype", "books");

  try {
    const res = await fetch(endpoint);
    const xml = await res.text();

    return parseOpenSearchXml(xml);
  } catch (e) {
    console.error("[NDL]", e);
  }
}
