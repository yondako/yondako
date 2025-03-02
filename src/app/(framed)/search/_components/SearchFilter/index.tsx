"use client";

import AdaptiveModalDrawer from "@/components/AdaptiveModalDrawer";
import Switch from "@/components/Switch";
import { PATH_SEARCH } from "@/constants/path";
import { type NDC, NDCList } from "@/types/ndc";
import { type ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { SearchResultProps } from "../SearchResult";
import Label from "./Label";

type Props = {
  children: ReactNode;
} & Partial<Pick<SearchResultProps, "ndc" | "sensitive" | "query">>;

export default function SearchFilter({
  children,
  ndc,
  sensitive,
  query,
}: Props) {
  const [selectedNDC, setSelectedNDC] = useState<NDC>(ndc ?? "");

  // 閉じたらリセット
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedNDC(ndc ?? "");
    }
  };

  return (
    <AdaptiveModalDrawer
      triggerChildren={children}
      onOpenChange={handleOpenChange}
    >
      {({ Title, Description, Close }) => (
        <form className="pt-6 lg:pt-0" action={PATH_SEARCH}>
          <input type="hidden" name="q" value={query} />
          <Label
            title="カテゴリー"
            description="お探しのジャンルを選択して、関連する書籍だけを表示します"
            Title={Title}
            Description={Description}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {NDCList.map(({ label, value }) => (
              <label
                className={twMerge(
                  "cursor-pointer rounded-full border border-accent px-5 py-1 text-xs transition hover:brightness-95",
                  value === selectedNDC
                    ? "bg-accent text-primary-background"
                    : "text-accent",
                )}
                key={value}
              >
                <input
                  type="radio"
                  name="ndc"
                  defaultValue={value}
                  checked={value === selectedNDC}
                  onChange={() => setSelectedNDC(value)}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <div>
              <Label
                title="センシティブな書籍を含める"
                description="タイトルに露骨な単語を含む書籍を検索結果に表示します"
                Title={Title}
                Description={Description}
              />
            </div>
            <Switch name="sensitive" defaultChecked={sensitive} />
          </div>
          <Close
            className="mt-6 block w-full cursor-pointer rounded-full bg-accent px-6 py-2 text-center text-primary-background text-sm transition hover:brightness-95"
            type="submit"
          >
            絞り込む
          </Close>
        </form>
      )}
    </AdaptiveModalDrawer>
  );
}
