import { readingStatusMetadata } from "@/constants/status";
import ReadingStatusButton, { readingStatusOrder } from "./ReadingStatusButton";
import { ShopLinks } from "./ShopLinks";
import { useOptimistic } from "react";
import type { ReadingStatus } from "@/types/readingStatus";
import { updateReadingStatus } from "../../_actions/updateReadingStatus";
import type { BookType } from "@/types/book";

type Props = {
  bookId: string;
  isbn10: string | null;
  readingStatus: ReadingStatus;
};

export default function Overlay({ bookId, isbn10, readingStatus }: Props) {
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(readingStatus);

  // 読書ステータスが変更された
  const changeStatusFormAction = async (formData: FormData) => {
    const newStatus = formData.get("status") as BookType["readingStatus"];

    addOptimisticStatus(newStatus);

    const result = await updateReadingStatus(bookId, newStatus);

    // TODO: トーストとかでエラーを表示する
    if (result.error || !result.book) {
      console.error(result.error);
      return;
    }
  };

  return (
    <>
      {isbn10 && <ShopLinks isbn10={isbn10} />}

      <form
        className="m-0 mx-auto mt-6 w-fit space-x-4 text-tako"
        action={changeStatusFormAction}
      >
        {readingStatusOrder.map((status) => {
          const meta = readingStatusMetadata.get(status);

          return meta ? (
            <ReadingStatusButton
              status={status}
              meta={meta}
              selected={optimisticStatus === status}
              key={status}
            />
          ) : null;
        })}
      </form>
    </>
  );
}
