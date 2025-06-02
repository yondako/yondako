"use client";

import IconSortAsc from "@/assets/icons/sort-ascending.svg";
import IconSortDesc from "@/assets/icons/sort-descending.svg";
import Button from "@/components/Button";
import Input from "@/components/Input";
import type { Order } from "@/types/order";
import { format, isValid, parse } from "date-fns";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css"; // react-day-picker のスタイルをインポート
import { useDebouncedCallback } from "use-debounce";
import {
  createFilterSearchParams,
  removeDateRangeParams, // 新しい関数（または拡張された関数）
  removeKeywordParam,
} from "./filterSearchParams"; // filterSearchParamsを適切に修正する必要あり

type Props = {
  isOrderAsc: boolean;
};

export default function Filter({ isOrderAsc }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Keyword search
  const debounced = useDebouncedCallback((value) => {
    const keyword = String(value).trim();
    router.replace(
      keyword === ""
        ? removeKeywordParam(searchParams)
        : createFilterSearchParams(searchParams, { keyword }),
    );
  }, 600);

  // Sort order
  const IconSort = isOrderAsc ? IconSortAsc : IconSortDesc;
  const nextOrder: Order = isOrderAsc ? "desc" : "asc";

  // Date range picker
  const initialFrom = searchParams.get("from");
  const initialTo = searchParams.get("to");

  const defaultSelected: DateRange | undefined =
    initialFrom && isValid(new Date(initialFrom)) && initialTo && isValid(new Date(initialTo))
      ? { from: new Date(initialFrom), to: new Date(initialTo) }
      : initialFrom && isValid(new Date(initialFrom))
        ? { from: new Date(initialFrom), to: undefined }
        : undefined;

  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    defaultSelected,
  );
  const [fromValue, setFromValue] = useState<string>(
    initialFrom ? format(new Date(initialFrom), "y-MM-dd") : "",
  );
  const [toValue, setToValue] = useState<string>(
    initialTo ? format(new Date(initialTo), "y-MM-dd") : "",
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    // URLのパラメータが変更されたら、日付ピッカーの状態も更新
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const newSelectedRange: DateRange | undefined =
      from && isValid(new Date(from)) && to && isValid(new Date(to))
        ? { from: new Date(from), to: new Date(to) }
        : from && isValid(new Date(from))
          ? { from: new Date(from), to: undefined }
          : undefined;
    setSelectedRange(newSelectedRange);
    setFromValue(from ? format(new Date(from), "y-MM-dd") : "");
    setToValue(to ? format(new Date(to), "y-MM-dd") : "");
  }, [searchParams]);


  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
    const date = parse(e.target.value, "y-MM-dd", new Date());
    if (!isValid(date)) {
      // 無効な日付の場合は何もしないか、エラー表示
      return;
    }
    if (selectedRange?.to && date > selectedRange.to) {
      setSelectedRange({ from: date, to: date });
      setToValue(format(date, "y-MM-dd"));
    } else {
      setSelectedRange((prev) => ({ ...prev, from: date }));
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToValue(e.target.value);
    const date = parse(e.target.value, "y-MM-dd", new Date());
    if (!isValid(date)) {
      // 無効な日付の場合は何もしないか、エラー表示
      return;
    }
    if (selectedRange?.from && date < selectedRange.from) {
      setSelectedRange({ from: date, to: date });
      setFromValue(format(date, "y-MM-dd"));
    } else {
      setSelectedRange((prev) => ({ ...prev, to: date }));
    }
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    if (range?.from) {
      setFromValue(format(range.from, "y-MM-dd"));
    } else {
      setFromValue("");
    }
    if (range?.to) {
      setToValue(format(range.to, "y-MM-dd"));
    } else {
      setToValue("");
    }
  };

  const applyDateFilter = () => {
    setShowDatePicker(false);
    const params = createFilterSearchParams(searchParams, {
      dateRange: selectedRange,
    });
    router.replace(params);
  };

  const clearDateFilter = () => {
    setShowDatePicker(false);
    setSelectedRange(undefined);
    setFromValue("");
    setToValue("");
    router.replace(removeDateRangeParams(searchParams));
  };


  // `filterSearchParams.ts` の修正も必要です。
  // `createFilterSearchParams` は `keyword`, `order`, `dateRange` を受け取れるようにし、
  // `removeDateRangeParams` は `from` と `to` パラメータを削除するようにします。
  // このサブタスクでは Filter.tsx のみを修正し、filterSearchParams.ts の修正は別タスクとします。

  return (
    <div className="flex w-full flex-col space-y-3 sm:flex-row sm:items-end sm:space-x-3 sm:space-y-0">
      <Input
        className="grow text-sm sm:max-w-64 lg:text-xs"
        placeholder="タイトルの一部"
        onChange={(e) => debounced(e.target.value)}
        defaultValue={searchParams.get("q") ?? ""}
        search
      />
      <div className="relative">
        <Button
            onClick={() => setShowDatePicker(!showDatePicker)}
            style="outline"
            className="w-full text-xs sm:w-auto"
        >
            記録日で絞り込み {fromValue && toValue ? `${fromValue} ~ ${toValue}` : fromValue ? `${fromValue} ~` : toValue ? `~ ${toValue}` : "(期間未選択)"}
        </Button>
        {showDatePicker && (
          <div className="absolute z-10 mt-1 rounded-md border bg-white p-4 shadow-lg">
            <DayPicker
              mode="range"
              selected={selectedRange}
              onSelect={handleRangeSelect}
              defaultMonth={selectedRange?.from || new Date()}
              footer={
                <div className="mt-4 flex justify-between">
                    <div>
                        <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                            開始日
                        </label>
                        <Input
                            type="date"
                            id="from"
                            value={fromValue}
                            onChange={handleFromChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="ml-2">
                        <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                            終了日
                        </label>
                        <Input
                            type="date"
                            id="to"
                            value={toValue}
                            onChange={handleToChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
              }
            />
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={clearDateFilter} style="text">
                クリア
              </Button>
              <Button onClick={applyDateFilter}>適用</Button>
            </div>
          </div>
        )}
      </div>

      <Button
        className="flex w-full items-center justify-center space-x-1 p-0 text-xs sm:w-40"
        asChild
        style="noBorder"
      >
        <Link
          href={createFilterSearchParams(searchParams, { order: nextOrder })}
          replace
        >
          <IconSort className="h-5" />
          <span>{isOrderAsc ? "登録日が古い" : "最近登録した"}</span>
        </Link>
      </Button>
    </div>
  );
}

// 次に、`filterSearchParams.ts` を修正する必要があります。
// このファイルは `Filter.tsx` と同じディレクトリにあると仮定しています。
// `src/app/(framed)/library/[status]/_components/LibraryBookList/filterSearchParams.ts`

// filterSearchParams.ts の修正内容（イメージ）：
/*
import type { DateRange } from "react-day-picker";
import { formatISO, parseISO } from 'date-fns';

export function createFilterSearchParams(
  currentSearchParams: URLSearchParams,
  params: {
    keyword?: string;
    order?: string; // Order 型をインポートした方が良い
    dateRange?: DateRange;
  },
): string {
  const newParams = new URLSearchParams(currentSearchParams.toString());
  if (params.keyword !== undefined) {
    if (params.keyword === "") {
      newParams.delete("q");
    } else {
      newParams.set("q", params.keyword);
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
  }
  return `?${newParams.toString()}`;
}

export function removeKeywordParam(currentSearchParams: URLSearchParams): string {
  const newParams = new URLSearchParams(currentSearchParams.toString());
  newParams.delete("q");
  return `?${newParams.toString()}`;
}

export function removeDateRangeParams(currentSearchParams: URLSearchParams): string {
  const newParams = new URLSearchParams(currentSearchParams.toString());
  newParams.delete("from");
  newParams.delete("to");
  return `?${newParams.toString()}`;
}
*/
