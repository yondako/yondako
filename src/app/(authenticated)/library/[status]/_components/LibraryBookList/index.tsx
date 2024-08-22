import BookList from "@/components/BookList";
import Pagination from "@/components/Pagination";
import SayTako from "@/components/SayTako";
import {
  searchBooksFromLibrary,
  type searchBooksFromLibraryOptions,
} from "@/db/queries/status";
import { auth } from "@/lib/auth";
import type { ReadingStatus } from "@/types/readingStatus";
import Filter from "./Filter";

const pageSize = 24;

export async function LibraryBookList(
  props: Omit<searchBooksFromLibraryOptions, "userId" | "pageSize">,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const { books, total } = await searchBooksFromLibrary({
    userId: session.user.id,
    pageSize,
    ...props,
  });

  const totalPage = Math.ceil(total / pageSize);

  return (
    <>
      <div className="mt-10 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 ">
        <h1 className="flex w-full grow-0 items-end font-bold sm:w-auto">
          <span className="text-4xl">{total}</span>
          <span className="text-base">冊</span>
        </h1>
        <Filter isOrderAsc={props.order === "asc"} />
      </div>
      {books.length === 0 ? (
        <SayTako message={getEmptyMessage(props.status)} />
      ) : (
        <>
          <BookList className="mt-2" items={books} />
          {totalPage !== 1 && (
            <Pagination
              className="mt-auto pt-10"
              currentPage={props.page}
              totalPage={totalPage}
            />
          )}
        </>
      )}
    </>
  );
}

/**
 * ライブラリのステータスに応じた空メッセージを取得
 * @param status ライブラリのステータス
 * @returns 空メッセージ
 */
function getEmptyMessage(status: ReadingStatus) {
  switch (status) {
    case "reading":
      return "ｶﾗｯﾎﾟ";
    case "read":
      return "ﾅﾆﾓﾅｲ";
    case "want_read":
      return "ｽｯｷﾘ";
    default:
      return "ｺｺﾊﾄﾞｺ";
  }
}
