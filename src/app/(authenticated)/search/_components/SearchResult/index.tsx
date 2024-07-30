import BookList from "@/app/(authenticated)/_components/BookList";
import { searchBookFromNDL } from "../../_actions/ndl.server";
import { getStatusesByBookIds } from "@/db/queries/status.server";
import { auth } from "@/lib/auth.server";

type Props = {
  query: string;
};

export async function SearchResult({ query }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    return <p className="mt-12 text-center">ログインが必要です</p>;
  }

  const results = await searchBookFromNDL({
    any: query,
    cnt: 50, // TODO: 仮。あとでページネーションする
  });

  // 検索エラー
  if (!results) {
    return (
      <p className="mt-12 text-center">
        検索できませんでした。
        <wbr />
        しばらく時間をおいて再度お試しください
      </p>
    );
  }

  if (results.length === 0) {
    return <p className="mt-12 text-center">みつかりませんでした</p>;
  }

  const readingStatuses = await getStatusesByBookIds(session.user.id, results);

  const items = results.map((detail) => {
    const readingStatus =
      readingStatuses.find((s) => s.bookId === detail.ndlBibId)?.status ??
      "none";

    return {
      detail,
      readingStatus,
    };
  });

  return <BookList className="mt-8" items={items} />;
}
