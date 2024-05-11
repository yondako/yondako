import BookList from "@/components/common/BookList";
import CommonLayout from "@/components/common/Layout";
import SearchBox from "@/components/common/SearchBox";
import { site } from "@/constants/site";
import { searchBookFromNDL } from "@/libs/ndl/api";
import { BookInfo, BookType } from "@/types/book";
import { createRoute } from "honox/factory";

const title = "キーワードで探す";

export default createRoute(async (c) => {
  let results: BookInfo[] = [];

  const query = c.req.query("q");
  if (query) {
    results = await searchBookFromNDL({ any: query, cnt: 100 });
  }

  const items: BookType[] = results.map((info) => ({
    info,
    liked: false,
    status: "none",
  }));

  return c.render(
    <CommonLayout current={title}>
      <form>
        <SearchBox name="q" defaultValue={query} />
      </form>
      <BookList className="mt-10" items={items} />
    </CommonLayout>,
    {
      title: `${title} | ${site.name}`,
    },
  );
});
