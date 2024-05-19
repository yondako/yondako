import BookList from "@/components/common/BookList";
import CommonLayout from "@/components/common/Layout";
import SearchBox from "@/components/common/SearchBox";
import { searchBookFromNDL } from "@/libs/ndl/api";
import { BookInfo, BookType } from "@/types/book";
import { createRoute } from "honox/factory";

const title = "キーワードで探す";

export default createRoute(async (c) => {
  let results: BookInfo[] | undefined = [];

  const query = c.req.query("q");

  if (query) {
    results = await searchBookFromNDL({ any: query, cnt: 100 });
  }

  // TODO:
  // - 検索結果にユーザーの読書ステータスを反映

  return c.render(
    <CommonLayout current={title}>
      <form>
        <SearchBox name="q" defaultValue={query} />
      </form>
      <SearchResult
        results={results?.map((info) => ({
          info,
          liked: false,
          status: "none",
        }))}
        isIdle={typeof query === "undefined"}
      />
    </CommonLayout>,
    {
      title: query ? `「${query}」の検索結果` : title,
    },
  );
});

type SearchResultProps = {
  results: BookType[] | undefined;
  isIdle: boolean;
};

function SearchResult({ results, isIdle }: SearchResultProps) {
  if (isIdle) {
    return (
      <p className="mx-auto mt-12 w-fit text-center font-noto-emoji animate-bounce cursor-grab">
        ₍₍⁽⁽🐙₎₎⁾⁾
      </p>
    );
  }

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

  return <BookList className="mt-10" items={results} />;
}
