import IconSortAsc from "@/assets/icons/sort-ascending.svg";
import IconSortDesc from "@/assets/icons/sort-descending.svg";
import BookList from "@/components/BookList";
import Button from "@/components/Button";
import Pagenation from "@/components/Pagination";
import SayTako from "@/components/SayTako";
import { getBooksByReadingStatus } from "@/db/queries/status";
import { auth } from "@/lib/auth";
import type { Order } from "@/types/order";
import type { ReadingStatus } from "@/types/readingStatus";
import Link from "next/link";

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

  const isOrderAsc = order === "asc";
  const nextOrder: Order = isOrderAsc ? "desc" : "asc";
  const IconSort = isOrderAsc ? IconSortAsc : IconSortDesc;

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
        <Button
          className="inline-flex h-fit items-center space-x-1 px-4 py-1 text-xs"
          asChild
        >
          <Link href={`/library/${status}?order=${nextOrder}`} replace>
            <IconSort className="h-5" />
            <span>{isOrderAsc ? "登録日が古い順" : "登録日が新しい順"}</span>
          </Link>
        </Button>
      </div>
      {books.length === 0 ? (
        <SayTako message={getEmptyMessage(status)} />
      ) : (
        <>
          <BookList items={books} />
          {totalPage !== 1 && (
            <Pagenation
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
