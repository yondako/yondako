import { OPENSEARCH_API_BASE_URL } from "@/constants/api";
import { parseOpenSearchResponse } from "./parse";

/**
 * キーワードから書籍を検索する (国立国会図書館サーチ / OpenSearch)
 * @param query キーワード
 * @returns 検索結果
 */
export const searchFromKeyword = async (query: string) => {
  const endpoint = new URL(OPENSEARCH_API_BASE_URL);

  endpoint.searchParams.append("any", query);
  endpoint.searchParams.append("cnt", "100");

  // データプロバイダ
  endpoint.searchParams.append("dpid", "iss-ndl-opac");

  // 対象を図書・雑誌・電子雑誌に絞る
  endpoint.searchParams.append("mediatype", "books periodicals online");

  const res = await fetch(endpoint);
  const xml = await res.text();

  return parseOpenSearchResponse(xml);
};
