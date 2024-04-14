import { parseOpenSearchResponse } from "./parse";

const BASE_URL = "https://iss.ndl.go.jp/api/opensearch";

/**
 * キーワードから書籍を検索する (国立国会図書館サーチ / OpenSearch)
 * @param query キーワード
 * @returns 検索結果
 */
export const searchFromKeyword = async (query: string) => {
  const endpoint = new URL(BASE_URL);
  endpoint.searchParams.append("any", query);
  endpoint.searchParams.append("cnt", "100");

  const res = await fetch(endpoint);
  const xml = await res.text();

  return parseOpenSearchResponse(xml);
};
