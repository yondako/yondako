import { updateReadingStatus } from "@/actions/updateReadingStatus";
import { readingStatusMetadata } from "@/constants/status";
import type { BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import { type ComponentPropsWithoutRef, useOptimistic, useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import BookReadingStatusButton, {
  type BookReadingStatusButtonProps,
} from "./ReadingStatusButton";

const order: ReadingStatus[] = ["want_read", "reading", "read"] as const;

type Props = {
  bookId: string;
  bookTitle: string;
  defaultStatus: ReadingStatus;
} & Pick<BookReadingStatusButtonProps, "compact"> &
  ComponentPropsWithoutRef<"form">;

export default function BookReadingStatusForm({
  bookId,
  bookTitle,
  defaultStatus,
  compact,
  className,
  ...props
}: Props) {
  const [displayReadingStatus, setDisplayReadingStatus] =
    useState(defaultStatus);
  const [optimisticStatus, addOptimisticStatus] =
    useOptimistic(displayReadingStatus);

  // 読書ステータスが変更された
  const changeStatusFormAction = async (formData: FormData) => {
    const newStatus = formData.get("status") as BookType["readingStatus"];

    addOptimisticStatus(newStatus);

    const result = await updateReadingStatus(bookId, newStatus);

    // 記録に失敗
    if (result.error || !result.book) {
      toast.error("記録に失敗しました", {
        description: (
          <p>
            {result.error ?? "時間をおいてもう一度お試しください"}
            <br />
            {bookTitle}
          </p>
        ),
      });

      addOptimisticStatus(defaultStatus);

      return;
    }

    setDisplayReadingStatus(result.book.readingStatus);
  };

  return (
    <form
      {...props}
      className={twMerge("text-accent", className)}
      action={changeStatusFormAction}
    >
      {order.map((status) => {
        const meta = readingStatusMetadata.get(status);

        return meta ? (
          <BookReadingStatusButton
            status={status}
            meta={meta}
            selected={status === optimisticStatus}
            compact={compact}
            key={status}
          />
        ) : null;
      })}
    </form>
  );
}
