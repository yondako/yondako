"use client";

import AdaptiveModalDrawer from "@/components/AdaptiveModalDrawer";
import Switch from "@/components/Switch";
import { URL_SEARCH } from "@/constants/redirect";
import { type NDC, NDCList } from "@/types/ndc";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { SearchResultProps } from "../SearchResult";
import Label from "./Label";

type Props = {
  children: ReactNode;
} & Partial<Pick<SearchResultProps, "ndc" | "sensitive" | "query">>;

export default function SearchFilter({
  children,
  ndc: defaultNDC,
  sensitive: defaultSensitive,
  query,
}: Props) {
  const [selectedNDC, setSelectedNDC] = useState<NDC>(defaultNDC ?? "");
  const [sensitive, setSensitive] = useState(defaultSensitive);

  const filteredUrl = useMemo(() => {
    const searchParams = new URLSearchParams({
      ...(query && { q: query }),
      ...(selectedNDC && { ndc: selectedNDC }),
      ...(sensitive && { sensitive: "true" }),
    });

    return `${URL_SEARCH}?${searchParams.toString()}`;
  }, [query, selectedNDC, sensitive]);

  return (
    <AdaptiveModalDrawer triggerChildren={children}>
      {({ Title, Description, Close }) => (
        <div className="pt-6 lg:pt-0">
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
                  selectedNDC === value
                    ? "bg-accent text-primary-background"
                    : "text-accent",
                )}
                key={value}
              >
                <input
                  type="radio"
                  name="ndc"
                  value={value}
                  checked={selectedNDC === value}
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
            <Switch
              name="sensitive"
              checked={sensitive}
              onCheckedChange={(checked) => setSensitive(checked)}
            />
          </div>
          <Close
            className="mt-6 block w-full cursor-pointer rounded-full bg-accent px-6 py-2 text-center text-primary-background text-sm transition hover:brightness-95"
            asChild
          >
            <Link href={filteredUrl}>絞り込む</Link>
          </Close>
        </div>
      )}
    </AdaptiveModalDrawer>
  );
}
