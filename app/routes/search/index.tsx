import { BookProps } from "@/components/common/Book";
import BookList from "@/components/common/BookList";
import CommonLayout from "@/components/common/Layout";
import SearchBox from "@/components/common/SearchBox";
import { site } from "@/constants/site";
import { createRoute } from "honox/factory";

const title = "キーワードで探す";

export default createRoute((c) => {
  const query = c.req.query("q");
  console.log(query);

  const items: BookProps[] = [
    {
      book: {
        id: "test",
        title:
          "アイドルマスターシャイニーカラーズ = THE IDOLM@STER SHINY COLORS. 5",
        authors: [
          "バンダイナムコエンターテインメント 原作",
          "しのざきあきら 漫画",
        ],
        publisher: "KADOKAWA",
        imageUrl: "https://placehold.jp/199x285.png",
      },
      liked: false,
      status: "none",
    },
    {
      book: {
        id: "test-2",
        title:
          "アイドルマスターシャイニーカラーズ = THE IDOLM@STER SHINY COLORS. 5",
        authors: [
          "バンダイナムコエンターテインメント 原作",
          "しのざきあきら 漫画",
        ],
        publisher: "KADOKAWA",
        imageUrl: "https://placehold.jp/199x285.png",
      },
      liked: false,
      status: "none",
    },
  ];

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
