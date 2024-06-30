import Book from "@/islands/Book";
import { BookType } from "@/types/book";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  items: BookType[];
} & ComponentProps<"div">;

export default function BookList({ items, ...props }: Props) {
  return (
    <div
      className={twMerge(
        "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 justify-items-center gap-6 [&>*]:w-full",
        props.className,
      )}
    >
      {items.map((book) => (
        <Book data={book} key={book.info.ndlBibId} />
      ))}
    </div>
  );
}
