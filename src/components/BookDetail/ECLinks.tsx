import IconExternalLink from "@/assets/icons/external-link.svg";
import Button from "../Button";
import { toIsbn10 } from "./toIsbn10";

type Props = {
  isbn: string;
};

/**
 * ECサイトへのリンクを表示するコンポーネント。Amazon、楽天、紀伊國屋などのオンライン書店へのリンクを表示します。
 */
export default function ECLinks({ isbn }: Props) {
  const isbn10 = toIsbn10(isbn);

  const links = [
    {
      title: "Amazon",
      url: () => {
        const url = new URL(`/gp/product/${isbn10}/`, "https://www.amazon.co.jp");

        return url.toString();
      },
    },
    {
      title: "Rakuten",
      url: () => {
        const url = new URL(`/search/mall/${isbn}/`, "https://search.rakuten.co.jp/");

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
        const url = new URL(`/ebook/search_10${isbn10}.html`, "https://honto.jp");

        return url.toString();
      },
    },
  ];

  return (
    <>
      <h2 className="mt-8">通販で購入する</h2>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {links.map(({ title, url }) => (
          <Button style="noBorder" asChild key={title}>
            <a
              className="flex justify-center py-2 text-accent text-xs"
              href={url()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {title}
              <IconExternalLink className="ml-1 h-4 w-4" />
            </a>
          </Button>
        ))}
      </div>
    </>
  );
}
