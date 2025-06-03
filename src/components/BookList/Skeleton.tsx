import { twMerge } from "tailwind-merge";
import BookCardSkeleton, {
  type BookCardSkeletonProps,
} from "../BookCard/Skeleton";

type Props = {
  count?: number;
  className?: string;
} & Pick<BookCardSkeletonProps, "pageReadingStatus">;

/**
 * BookListのローディング状態を表示するスケルトンコンポーネント。指定した数のスケルトンカードをグリッドレイアウトで表示します。
 */
export default function BookListSkeleton({
  count = 6,
  className,
  ...props
}: Props) {
  return (
    <div
      className={twMerge(
        "grid grid-cols-1 justify-items-center gap-x-6 gap-y-2 *:w-full md:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <BookCardSkeleton {...props} key={index.toString()} />
      ))}
    </div>
  );
}
