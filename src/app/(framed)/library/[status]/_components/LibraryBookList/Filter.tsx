"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import IconSortAsc from "#src/assets/icons/sort-ascending.svg";
import IconSortDesc from "#src/assets/icons/sort-descending.svg";
import Button from "#src/components/Button/index";
import Input from "#src/components/Input/index";
import type { Order } from "#src/types/order";
import {
  createFilterSearchParams,
  removeKeywordParam,
} from "./filterSearchParams";

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
    <div className="flex w-full space-x-3 sm:justify-end">
      <Input
        className="grow text-sm sm:max-w-64 lg:text-xs"
        placeholder="タイトルの一部"
        onChange={(e) => debounced(e.target.value)}
        search
      />

      <Button
        className="flex w-40 items-center justify-center space-x-1 border-0 bg-tertiary-background p-0 text-xs"
        asChild
      >
        <Link
          href={createFilterSearchParams(searchParams, undefined, nextOrder)}
          replace
        >
          <IconSort className="h-5" />
          <span>{isOrderAsc ? "登録日が古い" : "最近登録した"}</span>
        </Link>
      </Button>
    </div>
  );
}
