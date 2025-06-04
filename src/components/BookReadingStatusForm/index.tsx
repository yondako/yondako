import { toast } from "@/components/Toast";
import { readingStatusMetadata } from "@/constants/status";
import type { BookIdentifiers, BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useUpdateReadingStatus } from "#hooks/useUpdateReadingStatus";
import BookReadingStatusButton, { type BookReadingStatusButtonProps } from "./ReadingStatusButton";
import { createUndoToast } from "./undoToast";

const order: ReadingStatus[] = ["want_read", "reading", "read"] as const;

export type BookReadingStatusFormProps = {
  status: ReadingStatus;
  onChangeStatus: (status: ReadingStatus) => void;
  optimisticStatus: ReadingStatus;
  onChangeOptimisticStatus: (status: ReadingStatus) => void;
};

type Props = {
  identifiers: BookIdentifiers;
  bookTitle: string;
  className?: string;
  disableUndoToast?: boolean;
} & BookReadingStatusFormProps &
  Pick<BookReadingStatusButtonProps, "compact">;

/**
 * 本の読書ステータスを変更するためのフォーム
 */
export default function BookReadingStatusForm({
  identifiers,
  bookTitle,
  status,
  optimisticStatus,
  onChangeOptimisticStatus,
  onChangeStatus,
  compact,
  className,
  disableUndoToast = false,
  ...props
}: Props) {
  const pathname = usePathname();
  const { updateReadingStatusWithCache } = useUpdateReadingStatus();

  const showUndoToast = createUndoToast({
    identifiers,
    updateReadingStatusWithCache,
    onChangeOptimisticStatus,
    onChangeStatus,
  });

  // 読書ステータスが変更された
  const changeStatusFormAction = async (formData: FormData) => {
    const newStatus = formData.get("status") as BookType["readingStatus"];

    onChangeOptimisticStatus(newStatus);

    const result = await updateReadingStatusWithCache(identifiers, newStatus, status);

    // 記録に失敗
    if (result.error || !result.book) {
      toast.error("記録に失敗しました", {
        description: `${result.error ?? "時間をおいてもう一度お試しください"}\n${bookTitle}`,
      });

      onChangeOptimisticStatus(status);
      return;
    }

    onChangeStatus(result.book.readingStatus);

    if (!disableUndoToast) {
      showUndoToast(pathname, status, newStatus, bookTitle);
    }
  };

  return (
    <form {...props} className={twMerge("text-accent", className)} action={changeStatusFormAction}>
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
