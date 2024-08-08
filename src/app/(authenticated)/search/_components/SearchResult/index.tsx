import BookList from "@/components/BookList";
import Pagination from "@/components/Pagination";
import { getStatusesByBookIds } from "@/db/queries/status";
import { auth } from "@/lib/auth";
import { searchBooksFromNDL } from "@/lib/searchBooks";

const minLimit = 1;
const limit = 48;

type Props = {
  query: string;
  currentPage: number;
};

export async function SearchResult({ query, currentPage }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    return <p className="mt-12 text-center">ログインが必要です</p>;
  }

  const result = await searchBooksFromNDL({
    any: query,
    cnt: limit,
    // NOTE: idx は 1 始まりなので計算結果に +1 する
    idx: (currentPage - 1) * limit + 1 || minLimit,
  });

  // 検索エラー
  if (!result) {
    return (
      <p className="mt-12 text-center">
        検索できませんでした。
        <wbr />
        しばらく時間をおいて再度お試しください
      </p>
    );
  }

  if (result.books.length === 0) {
    return <p className="mt-12 text-center">みつかりませんでした</p>;
  }

  const readingStatuses = await getStatusesByBookIds(
    session.user.id,
    result.books,
  );

  const items = result.books.map((detail) => {
    const readingStatus =
      readingStatuses.find((s) => s.bookId === detail.ndlBibId)?.status ??
      "none";

    return {
      detail,
      readingStatus,
    };
  });

  const totalPage = Math.ceil(result.meta.totalResults / limit);

  return (
    <>
      <h1 className="mt-10 font-bold">
        <span className="text-4xl">{result.meta.totalResults}</span>
        <span className="text-base">冊 みつかりました</span>
      </h1>
      <BookList items={items} />
      {totalPage > 1 && (
        <Pagination
          className="mt-auto pt-10"
          currentPage={currentPage}
          totalPage={totalPage}
        />
      )}
    </>
  );
}
