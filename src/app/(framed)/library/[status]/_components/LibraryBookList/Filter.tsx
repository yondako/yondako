"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import IconSortAsc from "@/assets/icons/sort-ascending.svg";
import IconSortDesc from "@/assets/icons/sort-descending.svg";
import Button from "@/components/Button";
import Input from "@/components/Input";
import type { Order } from "@/types/order";
import { createFilterSearchParams, removeKeywordParam } from "./filterSearchParams";

type Props = {
  isOrderAsc: boolean;
};

/**
 * ライブラリページの書籍リストをフィルタリングするコンポーネント。ジャンル、著者、出版社などの条件で書籍を絞り込み、並び順の変更も可能です。
 */
export default function Filter({ isOrderAsc }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (value: string) => {
    const keyword = value.trim();
    router.replace(keyword === "" ? removeKeywordParam(searchParams) : createFilterSearchParams(searchParams, keyword));
  };

  const IconSort = isOrderAsc ? IconSortAsc : IconSortDesc;
  const nextOrder: Order = isOrderAsc ? "desc" : "asc";

  return (
    <div className="flex w-full space-x-3 sm:justify-end">
      <Input
        className="grow text-sm sm:max-w-64 lg:text-xs"
        placeholder="タイトルの一部"
        defaultValue={searchParams.get("q") ?? ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(e.currentTarget.value);
          }
        }}
        search
      />

      <Button className="flex w-40 items-center justify-center space-x-1 p-0 text-xs" asChild style="noBorder">
        <Link href={createFilterSearchParams(searchParams, undefined, nextOrder)} replace>
          <IconSort className="h-5" />
          <span>{isOrderAsc ? "登録日が古い" : "最近登録した"}</span>
        </Link>
      </Button>
    </div>
  );
}
