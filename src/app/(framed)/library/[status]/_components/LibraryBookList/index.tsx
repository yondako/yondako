"use client";

import BookList from "@/components/BookList";
import Pagination from "@/components/Pagination";
import SayTako from "@/components/SayTako";
import { type UseLibraryBooksOptions, useLibraryBooks } from "@/hooks/useLibraryBooks";
import { LIBRARY_MESSAGE, LIBRARY_MESSAGE_NONE } from "#src/constants/library-message.js";
import Filter from "./Filter";
import LibraryBookListSkeleton from "./Skeleton";

export const MAX_PAGE_ITEMS = 24;

type Props = Omit<UseLibraryBooksOptions, "pageSize">;

/**
 * クライアントサイドでライブラリデータを取得・表示
 */
export function LibraryBookList({ status, page, order, titleKeyword }: Props) {
  const { data, error, isLoading } = useLibraryBooks({
    status,
    page,
    pageSize: MAX_PAGE_ITEMS,
    order,
    titleKeyword,
  });

  if (isLoading) {
    return <LibraryBookListSkeleton pageReadingStatus={status} />;
  }

  // TODO: ちゃんとエラー表示つくる
  if (error || !data) {
    console.error("Failed to fetch library books:", error);
    return <SayTako message="ｴﾗｰ" />;
  }

  const totalPage = Math.ceil(data.total / MAX_PAGE_ITEMS);

  return (
    <>
      <div className="mt-10 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 ">
        <h1 className="flex w-full grow-0 items-end font-bold sm:w-auto">
          <span className="text-4xl">{data.total}</span>
          <span className="text-base">冊</span>
        </h1>
        <Filter isOrderAsc={order === "asc"} />
      </div>
      {data.books.length === 0 ? (
        <SayTako message={LIBRARY_MESSAGE.get(status) || LIBRARY_MESSAGE_NONE} />
      ) : (
        <>
          <BookList className="mt-2" items={data.books} />
          {totalPage !== 1 && <Pagination className="mt-auto pt-10" currentPage={page} totalPage={totalPage} />}
        </>
      )}
    </>
  );
}
