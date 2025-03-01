"use client";

import { NDCList } from "@/types/ndc";
import type { ComponentProps } from "react";
import type { SearchResultProps } from "../SearchResult";

type Props = ComponentProps<"select"> & Pick<SearchResultProps, "ndc">;

export default function GenreSelect({ ndc, ...props }: Props) {
  return (
    <div className="before:-translate-y-1/2 relative w-fit before:pointer-events-none before:absolute before:top-1/2 before:right-3 before:h-4 before:w-4 before:transform before:bg-chevron-down before:content-['']">
      <select
        className="appearance-none rounded-full bg-tertiary-background py-2 pr-10 pl-4 text-sm focus:outline focus:outline-2 focus:outline-accent"
        name="ndc"
        defaultValue={ndc}
        onChange={(e) => e.target.form?.submit()}
        {...props}
      >
        <option value="">すべて</option>
        {NDCList.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
