import IconExternalLink from "@/assets/icons/external-link.svg";
import Button from "../Button";

type Props = {
  title: string;
  isbn: string;
  ndlLink: string;
};

export default function BookLinks({ title, isbn, ndlLink }: Props) {
  const rakutenUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(title)}/200162/`;
  const booksUrl = `https://www.books.or.jp/book-details/${isbn.replaceAll("-", "")}`;

  return (
    <>
      <h2 className="mt-8">書籍を手にとる</h2>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button style="noBorder" asChild className="col-span-2">
          <a
            className="flex justify-center py-2 text-accent text-xs"
            href={rakutenUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            楽天市場でさがす
            <IconExternalLink className="ml-1 h-4 w-4" />
          </a>
        </Button>
        <Button style="noBorder" asChild>
          <a
            className="flex items-center justify-center py-2 text-accent text-xs"
            href={ndlLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            国会国立図書館
            <IconExternalLink className="ml-1 h-4 w-4" />
          </a>
        </Button>
        <Button style="noBorder" asChild>
          <a
            className="flex items-center justify-center py-2 text-accent text-xs"
            href={booksUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Books
            <IconExternalLink className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </div>
    </>
  );
}
