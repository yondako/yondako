import BookList from "@/components/common/BookList";
import CommonLayout from "@/components/common/Layout";
import SearchBox from "@/components/common/SearchBox";
import { site } from "@/constants/site";
import { searchBookFromNDL } from "@/libs/ndl/api";
import { BookInfo } from "@/types/book";
import { createRoute } from "honox/factory";

const title = "キーワードで探す";

export default createRoute(async (c) => {
  let results: BookInfo[] | undefined = [];

  const query = c.req.query("q");
  if (query) {
    results = await searchBookFromNDL({ any: query, cnt: 100 });
  }

  // TODO:
  // - 検索結果がない場合の表示
  // - 検索できなかった場合の表示
  // - 検索結果にユーザーの読書ステータスを反映

  return c.render(
    <CommonLayout current={title}>
      <form>
        <SearchBox name="q" defaultValue={query} />
      </form>
      {results ? (
        <BookList
          className="mt-10"
          items={results.map((info) => ({
            info,
            liked: false,
            status: "none",
          }))}
        />
      ) : (
        <p className="text-center">検索できませんでした</p>
      )}
    </CommonLayout>,
    {
      title: `${title} | ${site.name}`,
    },
  );
});
