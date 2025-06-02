import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import BookCardSkeleton from "../BookCard/Skeleton";

type Props = {
  count?: number;
} & ComponentPropsWithoutRef<"div">;

export default function BookListSkeleton({ count = 6, ...props }: Props) {
  return (
    <div
      className={twMerge(
        "grid grid-cols-1 justify-items-center gap-x-6 gap-y-2 *:w-full md:grid-cols-2 xl:grid-cols-3",
        props.className,
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <BookCardSkeleton key={`skeleton-${index.toString()}`} />
      ))}
    </div>
  );
}
