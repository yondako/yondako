import BookList from "@/components/BookList";
import Pagination from "@/components/Pagination";
import SayTako from "@/components/SayTako";
import { type SearchBooksFromLibraryOptions, searchBooksFromLibrary } from "@/db/queries/status";
import { getAuth } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import Filter from "./Filter";

import type { ReadingStatus } from "@/types/readingStatus";

export const pageSize = 24;

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

export async function LibraryBookList(props: Omit<SearchBooksFromLibraryOptions, "userId" | "pageSize">) {
  const { env } = getCloudflareContext();
  const auth = getAuth(env.DB);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const { books, total } = await searchBooksFromLibrary(env.DB, {
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
          {totalPage !== 1 && <Pagination className="mt-auto pt-10" currentPage={props.page} totalPage={totalPage} />}
        </>
      )}
    </>
  );
}
