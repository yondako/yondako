import Button from "@/components/Button";
import { toIsbn10 } from "@/lib/isbn";

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
        title="Rakuten"
        url={() => {
          const url = new URL(
            `/search/mall/${isbn}/`,
            "https://search.rakuten.co.jp/",
          );

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
        title="紀伊国屋"
        url={() => {
          const url = new URL(
            `/f/dsg-01-${isbn}`,
            "https://www.kinokuniya.co.jp/",
          );

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
    <Button
      className="inline-flex w-fit items-center space-x-1 border-tako bg-card px-4 py-1 text-sm text-tako text-xs"
      asChild
    >
      <a href={url()} target="_blank" rel="noreferrer">
        <span>{title}</span>
      </a>
    </Button>
  );
}
