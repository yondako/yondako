import BookList from "@/components/BookList";
import { searchBookFromNDL } from "../../_actions/ndl.server";

type Props = {
  query: string;
};

export async function SearchResult({ query }: Props) {
  const results = await searchBookFromNDL({
    any: query,
    cnt: 100, // TODO: 仮。あとでページネーションする
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

  return (
    <BookList
      className="mt-8"
      items={results?.map((info) => ({
        info,
        readingStatus: "none", // TODO: 実際のステータスを反映
      }))}
    />
  );
}
