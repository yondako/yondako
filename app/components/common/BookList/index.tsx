import Book from "@/islands/Book";
import { BookType } from "@/types/book";
import { Fragment } from "react/jsx-runtime";

type Props = {
  items: BookType[];
} & JSX.IntrinsicElements["div"];

export default function BookList({ items, ...props }: Props) {
  return (
    <div className={props.className}>
      {items.map((book, i) => {
        return (
          <Fragment key={book.info.ndlBibId}>
            {i !== 0 && <div className="my-6 w-full border-t border-line" />}
            <Book data={book} />
          </Fragment>
        );
      })}
    </div>
  );
}
