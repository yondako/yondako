import IconSortDesc from "@/assets/icons/sort-descending.svg";
import type { BookCardSkeletonProps } from "@/components/BookCard/Skeleton";
import BookListSkeleton from "@/components/BookList/Skeleton";
import Button from "@/components/Button";
import Input from "@/components/Input";

type Props = Pick<BookCardSkeletonProps, "pageReadingStatus">;

export default function LibraryBookListSkeleton({ pageReadingStatus }: Props) {
  return (
    <>
      {/* ヘッダー部分 */}
      <div className="mt-10 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="flex w-full grow-0 animate-pulse items-end font-bold sm:w-auto">
          <div className="h-10 w-16 rounded bg-gray-300" />
          <div className="ml-1 h-6 w-8 rounded bg-gray-200" />
        </div>

        {/* フィルター部分 - 実際のFilterコンポーネントと同じ構造でdisabled */}
        <div className="flex w-full space-x-3 sm:justify-end">
          <Input
            className="grow text-sm sm:max-w-64 lg:text-xs"
            placeholder="タイトルの一部"
            disabled
            search
          />

          <Button
            className="flex w-40 items-center justify-center space-x-1 p-0 text-xs"
            style="noBorder"
            disabled
          >
            <IconSortDesc className="h-5" />
            <span>最近登録した</span>
          </Button>
        </div>
      </div>

      {/* 書籍リストのスケルトン */}
      <BookListSkeleton
        className="mt-2"
        pageReadingStatus={pageReadingStatus}
        count={6}
      />
    </>
  );
}
