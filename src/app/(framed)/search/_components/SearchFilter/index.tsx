"use client";

import AdaptiveModalDrawer from "@/components/AdaptiveModalDrawer";
import Switch from "@/components/Switch";
import { PATH_SEARCH } from "@/constants/path";
import { NDCList } from "@/types/ndc";
import Link from "next/link";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { SearchResultProps } from "../SearchResult";
import CategoryButton from "./CategoryButton";
import Label from "./Label";

type Props = {
  children: ReactNode;
} & Partial<Pick<SearchResultProps, "ndc" | "sensitive" | "query" | "searchType">>;

/**
 * 検索フィルターコンポーネント
 *
 * NDCによるカテゴリーフィルタとセンシティブコンテンツのフィルタリング機能を提供します
 * デスクトップではモーダル、モバイルではドロワーとして表示されます
 */
export default function SearchFilter({ children, ndc = "", sensitive, query, searchType }: Props) {
  const commonCloseButtonStyle =
    "px-6 py-2.5 md:py-2 block w-full cursor-pointer rounded-full text-center hover:brightness-95 transition text-sm";

  return (
    <AdaptiveModalDrawer triggerChildren={children}>
      {({ Title, Description, Close }) => (
        <form className="pt-6 lg:pt-0" action={PATH_SEARCH}>
          <input type="hidden" name="q" value={query} />
          <input type="hidden" name="searchType" value={searchType} />
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
                id={`ndc-${value ?? "all"}`}
                key={value}
                defaultChecked={ndc === value}
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
          <div className="mt-8 flex flex-col gap-2 md:flex-row md:flex-row-reverse">
            <Close
              className={twMerge(commonCloseButtonStyle, "bg-accent text-center text-primary-background")}
              type="submit"
            >
              絞り込む
            </Close>
            <Close
              className={twMerge(commonCloseButtonStyle, "border border-accent text-center text-accent", "md:w-[40%]")}
              asChild
            >
              <Link href={`${PATH_SEARCH}?q=${query}`}>リセット</Link>
            </Close>
          </div>
        </form>
      )}
    </AdaptiveModalDrawer>
  );
}
