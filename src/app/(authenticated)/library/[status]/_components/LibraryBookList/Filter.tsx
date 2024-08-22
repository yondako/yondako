"use client";

import IconSortAsc from "@/assets/icons/sort-ascending.svg";
import IconSortDesc from "@/assets/icons/sort-descending.svg";
import Button from "@/components/Button";
import SearchBox from "@/components/SearchBox";
import type { Order } from "@/types/order";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { createFilterSearchParams, removeKeywordParam } from "./filterSearchParams";

type Props = {
  isOrderAsc: boolean;
};

export default function Filter({ isOrderAsc }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const debounced = useDebouncedCallback((value) => {
    const keyword = String(value).trim();

    router.replace(
      keyword === ""
        ? removeKeywordParam(searchParams)
        : createFilterSearchParams(searchParams, keyword),
    );
  }, 600);

  const IconSort = isOrderAsc ? IconSortAsc : IconSortDesc;
  const nextOrder: Order = isOrderAsc ? "desc" : "asc";

  return (
    <div className="flex items-center space-x-3">
      <SearchBox
        className="h-8 text-sm lg:text-xs"
        placeholder="タイトルの一部"
        onChange={(e) => debounced(e.target.value)}
      />

      <Button
        className="inline-flex h-8 w-40 items-center justify-center space-x-1 border-0 bg-tertiary-background p-0 text-xs"
        asChild
      >
        <Link
          href={createFilterSearchParams(searchParams, undefined, nextOrder)}
          replace
        >
          <IconSort className="h-5" />
          <span>{isOrderAsc ? "登録日が古い順" : "登録日が新しい順"}</span>
        </Link>
      </Button>
    </div>
  );
}
