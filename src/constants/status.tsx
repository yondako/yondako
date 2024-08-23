import IconBookFilled from "@/assets/icons/book-filled.svg";
import IconBook from "@/assets/icons/book.svg";
import IconBookmarkFilled from "@/assets/icons/bookmark-filled.svg";
import IconBookmark from "@/assets/icons/bookmark.svg";
import IconMoodEmptyFilled from "@/assets/icons/mood-empty-filled.svg";
import IconMoodEmpty from "@/assets/icons/mood-empty.svg";
import IconSquareCheckFilled from "@/assets/icons/square-check-filled.svg";
import IconSquareCheck from "@/assets/icons/square-check.svg";
import type { ReadingStatus } from "@/types/readingStatus";
import type { FunctionComponent, SVGProps } from "react";

export type ReadingStatusMetadataItem = {
  label: string;
  IconSolid: FunctionComponent<SVGProps<SVGElement>>;
  IconFilled: FunctionComponent<SVGProps<SVGElement>>;
};

/**
 * 読書ステータスと対応するラベル・アイコンのリスト
 */
export const readingStatusMetadata = new Map<
  ReadingStatus,
  ReadingStatusMetadataItem
>([
  [
    "none",
    {
      label: "よんでない",
      IconSolid: IconMoodEmpty,
      IconFilled: IconMoodEmptyFilled,
    },
  ],
  [
    "want_read",
    {
      label: "よみたい",
      IconSolid: IconBookmark,
      IconFilled: IconBookmarkFilled,
    },
  ],
  [
    "reading",
    {
      label: "よんでる",
      IconSolid: IconBook,
      IconFilled: IconBookFilled,
    },
  ],
  [
    "read",
    {
      label: "よんだ",
      IconSolid: IconSquareCheck,
      IconFilled: IconSquareCheckFilled,
    },
  ],
]);
