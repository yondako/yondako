"use client";

import SearchBox from "@/components/SearchBox";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEventHandler } from "react";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // クエリパラメータを更新してページを更新
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = formData.get("q");

    if (!query) {
      return;
    }

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("q", query?.toString());

    router.push(`/search?${newSearchParams.toString()}`);
  };

  return (
    <form className="m-0 w-full" onSubmit={handleSubmit}>
      <SearchBox
        name="q"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder="書籍名、著者名で検索"
      />
    </form>
  );
}
