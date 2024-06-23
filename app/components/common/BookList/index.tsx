import Book from "@/islands/Book";
import { classNames } from "@/libs/classNames";
import { BookType } from "@/types/book";
import { ComponentProps } from "react";

type Props = {
  items: BookType[];
} & ComponentProps<"div">;

export default function BookList({ items, ...props }: Props) {
  return (
    <div
      className={classNames(
        "grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 justify-items-center gap-x-4 gap-y-6",
        props.className,
      )}
    >
      {items.map((book) => (
        <Book data={book} key={book.info.ndlBibId} />
      ))}
    </div>
  );
}
