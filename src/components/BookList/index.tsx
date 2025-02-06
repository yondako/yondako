import type { BookType } from "@/types/book";
import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import BookCard from "../BookCard";

type Props = {
  items: BookType[];
} & ComponentPropsWithoutRef<"div">;

export default function BookList({ items, ...props }: Props) {
  return (
    <div
      className={twMerge(
        "grid grid-cols-1 justify-items-center gap-x-6 gap-y-2 *:w-full md:grid-cols-2 xl:grid-cols-3",
        props.className,
      )}
    >
      {items.map((book) => (
        <BookCard data={book} key={book.detail.link} />
      ))}
    </div>
  );
}
