import BookList from "@/app/(authenticated)/_components/BookList";
import IconSortAsc from "@/assets/icons/sort-ascending.svg";
import IconSortDesc from "@/assets/icons/sort-descending.svg";
import Button from "@/components/Button";
import { getBooksByReadingStatus } from "@/db/queries/status.server";
import { auth } from "@/lib/auth.server";
import type { Order } from "@/types/order";
import type { ReadingStatus } from "@/types/readingStatus";
import Link from "next/link";

type Props = {
  status: ReadingStatus;
  order: Order;
};

export async function LibraryBookList({ status, order }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const isOrderAsc = order === "asc";
  const nextOrder: Order = isOrderAsc ? "desc" : "asc";
  const IconSort = isOrderAsc ? IconSortAsc : IconSortDesc;

  const books = await getBooksByReadingStatus(session.user.id, status, order);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between space-x-4">
        <h1 className="font-bold">
          <span className="text-4xl">{books.length}</span>
          <span className="text-base">冊</span>
        </h1>
        <Button
          className="inline-flex h-fit items-center space-x-1 px-4 py-1 text-xs"
          asChild
        >
          <Link href={`/library/${status}?order=${nextOrder}`} replace>
            <IconSort className="h-5" />
            <span>{isOrderAsc ? "登録日が古い順" : "登録日が新しい順"}</span>
          </Link>
        </Button>
      </div>
      <BookList items={books} />
    </div>
  );
}
