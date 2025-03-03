"use client";

import AdaptiveModalDrawer from "@/components/AdaptiveModalDrawer";
import Switch from "@/components/Switch";
import { PATH_SEARCH } from "@/constants/path";
import { type NDC, NDCList } from "@/types/ndc";
import { type ReactNode, useState } from "react";
import type { SearchResultProps } from "../SearchResult";
import CategoryButton from "./CategoryButton";
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
  const handleAnimationEnd = (open: boolean) => {
    if (!open) {
      setSelectedNDC(ndc ?? "");
    }
  };

  return (
    <AdaptiveModalDrawer
      triggerChildren={children}
      onAnimationEnd={handleAnimationEnd}
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
              <CategoryButton
                label={label}
                value={value}
                checked={value === selectedNDC}
                onChange={() => setSelectedNDC(value)}
                key={value}
              />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-8">
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
            className="mt-6 block w-full cursor-pointer rounded-full bg-accent px-6 py-2 py-2.5 text-center text-primary-background text-sm transition hover:brightness-95"
            type="submit"
          >
            絞り込む
          </Close>
        </form>
      )}
    </AdaptiveModalDrawer>
  );
}
