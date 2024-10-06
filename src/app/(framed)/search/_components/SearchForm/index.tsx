"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type FormEventHandler, useRef } from "react";
import Input from "#src/components/Input/index";

export default function SearchForm() {
  const searchBoxRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  // クエリパラメータを更新してページを更新
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = formData.get("q");

    if (!query) {
      return;
    }

    searchBoxRef.current?.blur();

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("q", query?.toString());

    router.push(`/search?${newSearchParams.toString()}`);
  };

  return (
    <form className="m-0 w-full" onSubmit={handleSubmit}>
      <Input
        name="q"
        defaultValue={query ?? ""}
        placeholder="タイトル、著者名で検索"
        autoFocus={!query}
        inputMode="search"
        ref={searchBoxRef}
        search
      />
    </form>
  );
}
