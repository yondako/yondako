import IconExternalLink from "@/assets/icons/external-link.svg";
import Button from "../Button";

type Props = {
  title: string;
  ndlLink: string;
  isbn?: string | null;
};

export default function BookLinks({ title, isbn, ndlLink }: Props) {
  const isbnNumber = isbn ? isbn.replaceAll("-", "") : null;
  const rakutenUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(title)}/200162/`;

  return (
    <>
      <h2 className="mt-8">書籍を手にとる</h2>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {isbnNumber ? (
          <>
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
                国立国会図書館
                <IconExternalLink className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button style="noBorder" asChild>
              <a
                className="flex items-center justify-center py-2 text-accent text-xs"
                href={`https://www.books.or.jp/book-details/${isbnNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Books
                <IconExternalLink className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </>
        ) : (
          <Button style="noBorder" asChild className="col-span-2">
            <a
              className="flex justify-center py-2 text-accent text-xs"
              href={ndlLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              国立国会図書館
              <IconExternalLink className="ml-1 h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </>
  );
}
