import BookList from "@/components/BookList";
import Pagination from "@/components/Pagination";
import SayTako from "@/components/SayTako";
import {
  type SearchBooksFromLibraryOptions,
  searchBooksFromLibrary,
} from "@/db/queries/status";
import { getAuth } from "@/lib/auth";
import type { ReadingStatus } from "@/types/readingStatus";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isValid, parseISO } from "date-fns"; // isValid と parseISO をインポート
import { headers } from "next/headers";
import Filter from "./Filter";

const pageSize = 24;

// LibraryBookListProps の型を更新
export type LibraryBookListProps = Omit<
  SearchBooksFromLibraryOptions,
  "userId" | "pageSize" | "dateRange" // dateRangeを除外 (page.tsxから直接渡さないため)
> & {
  // page.tsx から渡されるクエリパラメータ
  fromQuery?: string;
  toQuery?: string;
};


export async function LibraryBookList(props: LibraryBookListProps) {
  const { env } = getCloudflareContext();
  const auth = getAuth(env.DB);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  // 日付範囲の処理
  let dateRange: SearchBooksFromLibraryOptions["dateRange"] | undefined = undefined;
  if (props.fromQuery && isValid(parseISO(props.fromQuery))) {
    dateRange = { ...dateRange, from: parseISO(props.fromQuery) };
  }
  if (props.toQuery && isValid(parseISO(props.toQuery))) {
    const toDate = parseISO(props.toQuery);
    // toDate はその日の終わりとして扱いたいが、DBクエリ側で調整するのでここではそのまま渡す
    dateRange = { ...dateRange, to: toDate };
  }

  const { books, total } = await searchBooksFromLibrary(env.DB, {
    userId: session.user.id,
    pageSize,
    status: props.status,
    order: props.order,
    page: props.page,
    titleKeyword: props.titleKeyword,
    dateRange, // 修正：dateRange を渡す
  });

  const totalPage = Math.ceil(total / pageSize);

  return (
    <>
      <div className="mt-10 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 ">
        <h1 className="flex w-full grow-0 items-end font-bold sm:w-auto">
          <span className="text-4xl">{total}</span>
          <span className="text-base">冊</span>
        </h1>
        {/* Filterコンポーネントからは isOrderAsc を削除 (Filter内でsearchParamsから判断) */}
        <Filter />
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
