import type { FunctionComponent, SVGProps } from "react";
import IconBookFilled from "#src/assets/icons/book-filled.svg";
import IconBook from "#src/assets/icons/book.svg";
import IconBookmarkFilled from "#src/assets/icons/bookmark-filled.svg";
import IconBookmark from "#src/assets/icons/bookmark.svg";
import IconMoodEmptyFilled from "#src/assets/icons/mood-empty-filled.svg";
import IconMoodEmpty from "#src/assets/icons/mood-empty.svg";
import IconSquareCheckFilled from "#src/assets/icons/square-check-filled.svg";
import IconSquareCheck from "#src/assets/icons/square-check.svg";
import type { ReadingStatus } from "#src/types/readingStatus";

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
