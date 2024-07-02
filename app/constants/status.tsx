import IconBookFilled from "@/assets/icons/book-filled.svg?react";
import IconBook from "@/assets/icons/book.svg?react";
import IconBookmarkFilled from "@/assets/icons/bookmark-filled.svg?react";
import IconBookmark from "@/assets/icons/bookmark.svg?react";
import IconMoodEmptyFilled from "@/assets/icons/mood-empty-filled.svg?react";
import IconMoodEmpty from "@/assets/icons/mood-empty.svg?react";
import IconSquareCheckFilled from "@/assets/icons/square-check-filled.svg?react";
import IconSquareCheck from "@/assets/icons/square-check.svg?react";
import { ReadingStatus } from "@/types/book";
import { FunctionComponent, SVGProps } from "react";

type StatusListItem = {
  label: string;
  IconSolid: FunctionComponent<SVGProps<SVGSVGElement>>;
  IconFilled: FunctionComponent<SVGProps<SVGSVGElement>>;
};

/**
 * 読書ステータスと対応するラベル・アイコンのリスト
 */
export const statusList = new Map<ReadingStatus, StatusListItem>([
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
