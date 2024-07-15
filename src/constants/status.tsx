import {
  Book,
  BookFilled,
  Bookmark,
  BookmarkFilled,
  MoodEmpty,
  MoodEmptyFilled,
  SquareCheck,
  SquareCheckFilled,
} from "@/components/common/Icons";
import type { ReadingStatus } from "@/types/book";
import type { FunctionComponent, SVGProps } from "react";

export type ReadingStatusMetadataItem = {
  label: string;
  IconSolid: FunctionComponent<SVGProps<SVGSVGElement>>;
  IconFilled: FunctionComponent<SVGProps<SVGSVGElement>>;
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
