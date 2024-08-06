import IconExternalLink from "@/assets/icons/external-link.svg";
import { toIsbn10 } from "@/lib/isbn";
import ExternalLink from "../ExternalLink";

export type ShopLinksProps = {
  rawIsbn: string;
};

export function ShopLinks({ rawIsbn }: ShopLinksProps) {
  const isbn = rawIsbn.replace(/-/g, "");
  const isbn10 = toIsbn10(rawIsbn);

  return (
    <>
      <ShopLink
        title="Amazon"
        url={() => {
          const url = new URL(
            `/gp/product/${isbn10}/`,
            "https://www.amazon.co.jp",
          );

          return url.toString();
        }}
      />

      <ShopLink
        title="楽天市場"
        url={() => {
          const url = new URL(
            `/search/mall/${isbn}/`,
            "https://search.rakuten.co.jp/",
          );

          return url.toString();
        }}
      />

      <ShopLink
        title="ヨドバシ.com"
        url={() => {
          const url = new URL(
            "https://www.yodobashi.com/ec/category/index.html",
          );

          url.searchParams.append("word", isbn);
          url.searchParams.append("extst", "rutles");

          return url.toString();
        }}
      />

      <ShopLink
        title="honto"
        url={() => {
          const url = new URL(
            `/ebook/search_10${isbn10}.html`,
            "https://honto.jp",
          );

          return url.toString();
        }}
      />

      <ShopLink
        title="紀伊国屋書店"
        url={() => {
          const url = new URL(
            `/f/dsg-01-${isbn}`,
            "https://www.kinokuniya.co.jp/",
          );

          return url.toString();
        }}
      />

      <ShopLink
        title="e-hon"
        url={() => {
          const url = new URL("https://www.e-hon.ne.jp/bec/SA/Forward");

          url.searchParams.append("cnt", "1");
          url.searchParams.append("scope", "isbn");
          url.searchParams.append("mode", "speed");
          url.searchParams.append("button", "btnSpeed");
          url.searchParams.append("spKeyword", isbn);

          return url.toString();
        }}
      />
    </>
  );
}

type ShopLinkProps = {
  title: string;
  url: () => string;
};

function ShopLink({ title, url }: ShopLinkProps) {
  return (
    <ExternalLink
      className="flex items-center text-text-sub text-xs"
      href={url()}
    >
      {title}
      <IconExternalLink className="ml-0.5 h-3 w-3" />
    </ExternalLink>
  );
}
