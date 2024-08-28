import BookList from "@/components/BookList";
import ErrorMessage from "@/components/ErrorMessage";
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
      <ErrorMessage
        title="検索できませんでした"
        decoration={
          <span className="-right-2 absolute top-0 text-5xl">🔧</span>
        }
      >
        <p className="mt-3">一時的に検索が利用できない状態です。</p>
        <p>時間をおいて、再度お試しください。</p>
      </ErrorMessage>
    );
  }

  // 見つからない
  if (result.books.length === 0) {
    return (
      <ErrorMessage
        title="見つかりませんでした"
        decoration={
          <span className="-right-8 absolute top-0 text-5xl">❓️</span>
        }
      >
        <p className="mt-3">該当する書籍が見つかりませんでした。</p>
        <p>キーワードを変更して、再度お試しください。</p>
      </ErrorMessage>
    );
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
