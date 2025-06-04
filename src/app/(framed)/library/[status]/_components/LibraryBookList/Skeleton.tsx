import IconSortDesc from "@/assets/icons/sort-descending.svg";
import type { BookCardSkeletonProps } from "@/components/BookCard/Skeleton";
import BookListSkeleton from "@/components/BookList/Skeleton";
import Button from "@/components/Button";
import Input from "@/components/Input";

type Props = Pick<BookCardSkeletonProps, "pageReadingStatus">;

/**
 * ライブラリ書籍リストのローディング状態を表示するスケルトンコンポーネント。フィルターと書籍カードのスケルトンを組み合わせて表示します。
 */
export default function LibraryBookListSkeleton({ pageReadingStatus }: Props) {
  return (
    <>
      <div className="mt-10 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="w-full">
          <div className="h-10 w-16 rounded bg-primary-foreground/20" />
        </div>

        {/* フィルターUI */}
        <div className="flex w-full space-x-3 sm:justify-end">
          <Input className="grow text-sm sm:max-w-64 lg:text-xs" placeholder="タイトルの一部" disabled search />

          <Button className="flex w-40 items-center justify-center space-x-1 p-0 text-xs" style="noBorder" disabled>
            <IconSortDesc className="h-5" />
            <span>最近登録した</span>
          </Button>
        </div>
      </div>

      {/* 書籍リスト */}
      <BookListSkeleton className="mt-2" pageReadingStatus={pageReadingStatus} count={6} />
    </>
  );
}
