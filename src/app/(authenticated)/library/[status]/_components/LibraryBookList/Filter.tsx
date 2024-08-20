"use client";

import Button from "@/components/Button";
import SearchBox from "@/components/SearchBox";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEventHandler } from "react";
import type { Order } from "@/types/order";
import IconSortAsc from "@/assets/icons/sort-ascending.svg";
import IconSortDesc from "@/assets/icons/sort-descending.svg";
import Link from "next/link";

type Props = {
  isOrderAsc: boolean;
};

export default function Filter({ isOrderAsc }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const IconSort = isOrderAsc ? IconSortAsc : IconSortDesc;
  const nextOrder: Order = isOrderAsc ? "desc" : "asc";

  const createHref = (query?: string, order?: Order): string => {
    const newSearchParams = new URLSearchParams(searchParams);

    // 絞り込みクエリ
    if (query) {
      newSearchParams.set("q", query);
    }

    // ソート順
    if (order) {
      newSearchParams.set("order", order);
    }

    return `?${newSearchParams.toString()}`;
  };

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = formData.get("q")?.toString();

    router.push(createHref(query));
  };

  return (
    <div className="flex items-center space-x-3">
      <form onSubmit={handleSubmitForm}>
        <SearchBox
          className="h-8 text-sm lg:text-xs"
          placeholder="タイトル・著者"
          name="q"
        />
      </form>

      <Button
        className="inline-flex h-8 w-40 items-center justify-center space-x-1 border-0 bg-tertiary-background p-0 text-xs"
        asChild
      >
        <Link href={createHref(undefined, nextOrder)} replace>
          <IconSort className="h-5" />
          <span>{isOrderAsc ? "登録日が古い順" : "登録日が新しい順"}</span>
        </Link>
      </Button>
    </div>
  );
}
