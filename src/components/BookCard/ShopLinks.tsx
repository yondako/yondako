import IconExternalLink from "@/assets/icons/external-link.svg";
import { toIsbn10 } from "@/lib/isbn";
import ExternalLink from "../ExternalLink";

export type ShopLinksProps = {
  rawIsbn: string;
};

type ShopMetaData = {
  title: string;
  url: () => string;
};

function createShopList(isbn: string): ShopMetaData[] {
  const isbn10 = toIsbn10(isbn);

  return [
    {
      title: "Amazon",
      url: () => {
        const url = new URL(
          `/gp/product/${isbn10}/`,
          "https://www.amazon.co.jp",
        );

        return url.toString();
      },
    },
    {
      title: "楽天市場",
      url: () => {
        const url = new URL(
          `/search/mall/${isbn}/`,
          "https://search.rakuten.co.jp/",
        );

        return url.toString();
      },
    },
    {
      title: "ヨドバシ.com",
      url: () => {
        const url = new URL("https://www.yodobashi.com/ec/category/index.html");

        url.searchParams.append("word", isbn);
        url.searchParams.append("extst", "rutles");

        return url.toString();
      },
    },
    {
      title: "honto",
      url: () => {
        const url = new URL(
          `/ebook/search_10${isbn10}.html`,
          "https://honto.jp",
        );

        return url.toString();
      },
    },
    {
      title: "紀伊国屋書店",
      url: () => {
        const url = new URL(
          `/f/dsg-01-${isbn}`,
          "https://www.kinokuniya.co.jp/",
        );

        return url.toString();
      },
    },
    {
      title: "e-hon",
      url: () => {
        const url = new URL("https://www.e-hon.ne.jp/bec/SA/Forward");

        url.searchParams.append("cnt", "1");
        url.searchParams.append("scope", "isbn");
        url.searchParams.append("mode", "speed");
        url.searchParams.append("button", "btnSpeed");
        url.searchParams.append("spKeyword", isbn);

        return url.toString();
      },
    },
  ];
}

export function ShopLinks({ rawIsbn }: ShopLinksProps) {
  const isbn = rawIsbn.replace(/-/g, "");
  const shopList = createShopList(isbn);

  return shopList.map(({ title, url }) => (
    <ExternalLink
      className="flex items-center text-primary-foreground text-xs"
      href={url()}
      key={title}
    >
      {title}
      <IconExternalLink className="ml-0.5 h-3 w-3" />
    </ExternalLink>
  ));
}
