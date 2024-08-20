import BookList from "@/components/BookList";
import Pagination from "@/components/Pagination";
import SayTako from "@/components/SayTako";
import { getBooksByReadingStatus } from "@/db/queries/status";
import { auth } from "@/lib/auth";
import type { Order } from "@/types/order";
import type { ReadingStatus } from "@/types/readingStatus";
import Filter from "./Filter";

const pageSize = 24;

type Props = {
  status: ReadingStatus;
  page: number;
  order: Order;
};

export async function LibraryBookList({ status, page, order }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const { books, total } = await getBooksByReadingStatus(
    session.user.id,
    status,
    order,
    page,
    pageSize,
  );
  const totalPage = Math.ceil(total / pageSize);

  return (
    <>
      <div className="mt-10 flex items-center justify-between space-x-4 ">
        <h1 className="font-bold">
          <span className="text-4xl">{total}</span>
          <span className="text-base">冊</span>
        </h1>
        <Filter isOrderAsc={order === "asc"} />
      </div>
      {books.length === 0 ? (
        <SayTako message={getEmptyMessage(status)} />
      ) : (
        <>
          <BookList items={books} />
          {totalPage !== 1 && (
            <Pagination
              className="mt-auto pt-10"
              currentPage={page}
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
