import IconDotsVertical from "@/assets/icons/dots-vertical.svg";
import { readingStatusMetadata } from "@/constants/status";
import { readingStatusValues } from "@/types/readingStatus";
import { twMerge } from "tailwind-merge";
import BookReadingStatusButton from "../BookReadingStatusForm/ReadingStatusButton";

export type BookCardSkeletonProps = {
  pageReadingStatus: string;
  className?: string;
};

/**
 * BookCardのローディング状態を表示するスケルトンコンポーネント。コンテンツが読み込まれる前に表示されます。
 */
export default function BookCardSkeleton({ pageReadingStatus, className }: BookCardSkeletonProps) {
  return (
    <div
      className={twMerge("@container relative mt-8 w-full animate-pulse text-left text-primary-foreground", className)}
    >
      <div className="flex h-40 w-full flex-col justify-between overflow-hidden rounded-2xl bg-tertiary-background p-4 pl-36 text-left">
        {/* タイトルと著者 */}
        <div className="space-y-1">
          <div className="space-y-1">
            <div className="h-4 w-full rounded bg-primary-foreground/20" />
            <div className="h-4 w-4/5 rounded bg-primary-foreground/20" />
          </div>
          <div className="mt-2 h-3 w-2/5 rounded bg-secondary-foreground/20" />
        </div>
      </div>

      {/* 読書ステータスボタン */}
      <div className="absolute bottom-4 left-36 text-accent">
        {readingStatusValues.slice(1).map((status) => {
          const meta = readingStatusMetadata.get(status);
          const isSelected = status === pageReadingStatus;

          return meta ? (
            <BookReadingStatusButton key={status} status={status} meta={meta} selected={isSelected} compact />
          ) : null;
        })}
      </div>

      {/* メニューアイコン */}
      <IconDotsVertical className="pointer-events-none absolute right-5 bottom-6 @xs:block hidden h-4 w-4 rounded-2xl text-secondary-foreground" />

      {/* 書影 */}
      <div className="-top-4 pointer-events-none absolute left-4 h-full w-28 overflow-hidden rounded-2xl border-4 border-tertiary-background shadow-xl">
        <div className="h-full w-full bg-secondary-background" />
      </div>
    </div>
  );
}
