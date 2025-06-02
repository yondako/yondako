// src/app/(framed)/library/[status]/_components/LibraryBookList/filterSearchParams.ts
import type { Order } from "@/types/order"; // Order 型を適切にインポート
import { formatISO } from 'date-fns';
import type { DateRange } from "react-day-picker";

/**
 * クエリパラメータを生成するためのオプション
 */
type CreateFilterParamsOptions = {
  keyword?: string;
  order?: Order;
  dateRange?: DateRange;
};

/**
 * 現在の検索パラメータと新しい絞り込み条件から、新しい検索パラメータ文字列を生成します。
 * @param currentSearchParams 現在の URLSearchParams
 * @param params 新しい絞り込み条件
 * @returns 新しい検索パラメータ文字列 (例: "?q=keyword&order=asc&from=2023-01-01&to=2023-01-31")
 */
export function createFilterSearchParams(
  currentSearchParams: URLSearchParams,
  params: CreateFilterParamsOptions,
): string {
  const newParams = new URLSearchParams(currentSearchParams.toString());

  if (params.keyword !== undefined) {
    if (params.keyword.trim() === "") {
      newParams.delete("q");
    } else {
      newParams.set("q", params.keyword.trim());
    }
  }

  if (params.order) {
    newParams.set("order", params.order);
  }

  if (params.dateRange) {
    if (params.dateRange.from) {
      newParams.set("from", formatISO(params.dateRange.from, { representation: 'date' }));
    } else {
      newParams.delete("from");
    }
    if (params.dateRange.to) {
      newParams.set("to", formatISO(params.dateRange.to, { representation: 'date' }));
    } else {
      newParams.delete("to");
    }
  } else {
    // params.dateRange が undefined の場合、既存の日付パラメータを維持するか削除するかは要件による
    // ここでは、明示的に dateRange が渡されない場合は何もしない（既存の from/to を維持）
    // もしクリアしたい場合は、呼び出し側で { dateRange: { from: undefined, to: undefined } } のように渡すか、
    // removeDateRangeParams を別途呼び出す。
  }

  // page パラメータはリセットする (絞り込み条件が変わったら1ページ目に戻す)
  newParams.delete("page");


  const queryString = newParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * 現在の検索パラメータからキーワードパラメータを削除した新しい検索パラメータ文字列を生成します。
 * @param currentSearchParams 現在の URLSearchParams
 * @returns 新しい検索パラメータ文字列
 */
export function removeKeywordParam(currentSearchParams: URLSearchParams): string {
  const newParams = new URLSearchParams(currentSearchParams.toString());
  newParams.delete("q");
  // page パラメータはリセットする
  newParams.delete("page");
  const queryString = newParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * 現在の検索パラメータから日付範囲パラメータ (`from`, `to`) を削除した新しい検索パラメータ文字列を生成します。
 * @param currentSearchParams 現在の URLSearchParams
 * @returns 新しい検索パラメータ文字列
 */
export function removeDateRangeParams(currentSearchParams: URLSearchParams): string {
  const newParams = new URLSearchParams(currentSearchParams.toString());
  newParams.delete("from");
  newParams.delete("to");
  // page パラメータはリセットする
  newParams.delete("page");
  const queryString = newParams.toString();
  return queryString ? `?${queryString}` : "";
}
