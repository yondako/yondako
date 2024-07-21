import { OPENSEARCH_API_BASE_URL } from "@/constants/api";
import { parseOpenSearchResponse } from "../_lib/parse";

type SearchOptions = {
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
export const searchBookFromNDL = async (opts: SearchOptions) => {
  const endpoint = new URL(OPENSEARCH_API_BASE_URL);

  for (const [key, value] of Object.entries(opts)) {
    endpoint.searchParams.append(
      key,
      typeof value === "number" ? value.toString() : value,
    );
  }

  // データプロバイダ
  endpoint.searchParams.append("dpid", "iss-ndl-opac");

  // 対象を図書・雑誌・電子雑誌に絞る
  endpoint.searchParams.append("mediatype", "books periodicals");

  try {
    const res = await fetch(endpoint);
    const xml = await res.text();

    return parseOpenSearchResponse(xml);
  } catch (e) {
    console.error("[NDL]", e);
  }
};
