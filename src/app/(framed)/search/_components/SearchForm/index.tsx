"use client";

import Input from "@/components/Input";
import { NDCList } from "@/types/ndc";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEventHandler, useRef } from "react";
import { twMerge } from "tailwind-merge";

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
    <form
      className="m-0 flex w-full items-center gap-2"
      onSubmit={handleSubmit}
    >
      <div
        className={
          "before:-translate-y-1/2 relative before:pointer-events-none before:absolute before:top-1/2 before:right-3 before:h-4 before:w-4 before:transform before:bg-chevron-down before:content-['']"
        }
      >
        <select
          className="appearance-none rounded-full bg-tertiary-background py-2 pr-10 pl-4 text-sm focus:outline focus:outline-2 focus:outline-accent"
          name="ndc"
        >
          <option value="">すべて</option>
          {NDCList.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <Input
        className="grow"
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
