import IconHelp from "@/assets/icons/help.svg?react";
import BookList from "@/components/common/BookList";
import CommonLayout from "@/components/common/Layout";
import Link from "@/components/common/Link";
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

  return c.render(
    <CommonLayout current={title}>
      <div className="flex flex-col md:flex-row items-end md:items-center">
        <form className="m-0 w-full">
          <SearchBox
            name="q"
            defaultValue={query}
            placeholder="書籍名、著者名で検索"
          />
        </form>

        <Link
          className="mt-4 md:mt-0 md:ml-4 flex items-center shrink-0 text-xs space-x-1"
          href="https://docs.yondako.com/data-source"
        >
          <IconHelp className="w-4 h-4" />
          <span>データはどこから取得してるの？</span>
        </Link>
      </div>

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

  return <BookList className="mt-8" items={results} />;
}
