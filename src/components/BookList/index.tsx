import type { BookType } from "@/types/book";
import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import type { BookCardProps } from "../BookCard";
import BookCard from "../BookCard";

type Props = {
  items: BookType[];
} & Pick<BookCardProps, "hideReadingStatusBadge"> &
  ComponentPropsWithoutRef<"div">;

export default function BookList({
  items,
  hideReadingStatusBadge,
  ...props
}: Props) {
  return (
    <div
      className={twMerge(
        "grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 xl:grid-cols-3 [&>*]:w-full",
        props.className,
      )}
    >
      {items.map((book) => (
        <BookCard
          data={book}
          hideReadingStatusBadge={hideReadingStatusBadge}
          key={book.detail.link}
        />
      ))}
    </div>
  );
}
