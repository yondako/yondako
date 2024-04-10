import type { BookProps } from "@/components/common/Book";
import BookList from "@/components/common/BookList";
import LibraryLayout from "@/components/library/Layout";
import { site } from "@/constants/site";
import { createRoute } from "honox/factory";

export default createRoute((c) => {
  const testData: BookProps[] = [
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
    <LibraryLayout current="よむ本">
      <BookList className="mt-10" items={testData} />
    </LibraryLayout>,
    {
      title: `よむ本 | ${site.name}`,
    },
  );
});
