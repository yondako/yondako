import type { ReadonlyURLSearchParams } from "next/navigation";
import type { Order } from "@/types/order";

/**
 * 絞り込み条件のクエリパラメータを作成
 * @param searchParams 現在のクエリパラメータ
 * @param keyword キーワード (書籍タイトルの一部)
 * @param order 並び順
 * @returns 連結済みのクエリパラメータ文字列
 */
export function createFilterSearchParams(
  searchParams: ReadonlyURLSearchParams,
  keyword?: string,
  order?: Order,
): string {
  const newSearchParams = new URLSearchParams(searchParams);

  // 絞り込みキーワード
  if (keyword) {
    newSearchParams.set("q", keyword);
  }

  // ソート順
  if (order) {
    newSearchParams.set("order", order);
  }

  return `?${newSearchParams.toString()}`;
}

/**
 * キーワードパラメータを削除したクエリパラメータを作成
 * @returns 連結済みのクエリパラメータ文字列
 */
export function removeKeywordParam(prevSearchParams: ReadonlyURLSearchParams): string {
  const newSearchParams = new URLSearchParams(prevSearchParams);

  newSearchParams.delete("q");

  return `?${newSearchParams.toString()}`;
}
