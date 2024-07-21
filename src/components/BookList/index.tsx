import type { BookType } from "@/types/book";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import type { BookCardProps } from "../BookCard";
import BookCard from "../BookCard";

type Props = {
  items: BookType[];
} & Pick<BookCardProps, "hideReadingStatusBadge"> &
  ComponentProps<"div">;

export default function BookList({
  items,
  hideReadingStatusBadge,
  ...props
}: Props) {
  return (
    <div
      className={twMerge(
        "grid grid-cols-1 justify-items-center gap-6 lg:grid-cols-2 xl:grid-cols-3 [&>*]:w-full",
        props.className,
      )}
    >
      {items.map((book) => (
        <BookCard
          data={book}
          hideReadingStatusBadge={hideReadingStatusBadge}
          key={book.info.ndlBibId}
        />
      ))}
    </div>
  );
}
