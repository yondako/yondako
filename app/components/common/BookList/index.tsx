import Book from "@/islands/Book";
import { BookType } from "@/types/book";

type Props = {
  items: BookType[];
} & JSX.IntrinsicElements["div"];

export default function BookList({ items, ...props }: Props) {
  return (
    <div className={props.className}>
      {items.map((book, i) => {
        return (
          <>
            {i !== 0 && (
              <div
                className="my-6 w-full border-t border-line"
                key={`hr-${i.toString()}`}
              />
            )}
            <Book data={book} key={book.info.ndlBibId} />
          </>
        );
      })}
    </div>
  );
}
