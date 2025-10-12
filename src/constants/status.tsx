import type { FunctionComponent, SVGProps } from "react";
import IconBook from "@/assets/icons/book.svg";
import IconBookFilled from "@/assets/icons/book-filled.svg";
import IconBookmark from "@/assets/icons/bookmark.svg";
import IconBookmarkFilled from "@/assets/icons/bookmark-filled.svg";
import IconBookmarks from "@/assets/icons/bookmarks.svg";
import IconBookmarksFilled from "@/assets/icons/bookmarks-filled.svg";
import IconMoodEmpty from "@/assets/icons/mood-empty.svg";
import IconMoodEmptyFilled from "@/assets/icons/mood-empty-filled.svg";
import IconSquareCheck from "@/assets/icons/square-check.svg";
import IconSquareCheckFilled from "@/assets/icons/square-check-filled.svg";
import type { ReadingStatus } from "@/types/readingStatus";

export type ReadingStatusMetadataItem = {
  label: string;
  IconSolid: FunctionComponent<SVGProps<SVGElement>>;
  IconFilled: FunctionComponent<SVGProps<SVGElement>>;
};

/**
 * 読書ステータスと対応するラベル・アイコンのリスト
 */
export const readingStatusMetadata = new Map<ReadingStatus, ReadingStatusMetadataItem>([
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
  [
    "all",
    {
      label: "すべて",
      IconSolid: IconBookmarks,
      IconFilled: IconBookmarksFilled,
    },
  ],
]);

export const readingStatusOrder: ReadingStatus[] = ["all", "want_read", "reading", "read"];
