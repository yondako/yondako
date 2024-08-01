import BookFilled from "@/assets/icons/book-filled.svg";
import Book from "@/assets/icons/book.svg";
import BookmarkFilled from "@/assets/icons/bookmark-filled.svg";
import Bookmark from "@/assets/icons/bookmark.svg";
import MoodEmptyFilled from "@/assets/icons/mood-empty-filled.svg";
import MoodEmpty from "@/assets/icons/mood-empty.svg";
import SquareCheckFilled from "@/assets/icons/square-check-filled.svg";
import SquareCheck from "@/assets/icons/square-check.svg";
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
      IconSolid: MoodEmpty,
      IconFilled: MoodEmptyFilled,
    },
  ],
  [
    "want_read",
    {
      label: "よみたい",
      IconSolid: Bookmark,
      IconFilled: BookmarkFilled,
    },
  ],
  [
    "reading",
    {
      label: "よんでる",
      IconSolid: Book,
      IconFilled: BookFilled,
    },
  ],
  [
    "read",
    {
      label: "よんだ",
      IconSolid: SquareCheck,
      IconFilled: SquareCheckFilled,
    },
  ],
]);
