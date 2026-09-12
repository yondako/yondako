"use client";

import { useParams } from "next/navigation";
import type { ReadingStatus } from "@/types/readingStatus";
import LibraryBookListSkeleton from "./_components/LibraryBookList/Skeleton";
import Tab from "./_components/Tab";

export default function Loading() {
  const { status } = useParams<{ status: ReadingStatus }>();

  return (
    <div>
      <output className="sr-only">ライブラリを読み込み中</output>
      <Tab current={status} />
      <div aria-hidden="true" inert>
        <LibraryBookListSkeleton pageReadingStatus={status} />
      </div>
    </div>
  );
}
