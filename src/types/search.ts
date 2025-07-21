import { fallback, type InferOutput, picklist } from "valibot";

/**
 * 検索タイプのスキーマ
 */
export const searchTypeSchema = fallback(picklist(["any", "title", "creator"]), "title");

/**
 * 検索タイプ
 */
export type SearchType = InferOutput<typeof searchTypeSchema>;

/**
 * デフォルトの検索タイプ
 */
export const DEFAULT_SEARCH_TYPE: SearchType = "title";
