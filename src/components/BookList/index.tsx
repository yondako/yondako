import type { BookType } from "@/types/book";
import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import BookCard from "../BookCard";
import BookCardSkeleton from "../BookCard/Skeleton";

type Props = {
  items: (BookType | undefined)[];
} & ComponentPropsWithoutRef<"div">;

/**
 * 書籍リストを表示するコンポーネント
 */
export default function BookList({ items, ...props }: Props) {
  return (
    <div
      className={twMerge(
        "grid grid-cols-1 justify-items-center gap-x-6 gap-y-2 *:w-full md:grid-cols-2 xl:grid-cols-3",
        props.className,
      )}
    >
      {items.map((book, index) =>
        book ? (
          <BookCard data={book} key={book.detail.link} />
        ) : (
          <BookCardSkeleton pageReadingStatus="none" key={index.toString()} />
        ),
      )}
    </div>
  );
}
