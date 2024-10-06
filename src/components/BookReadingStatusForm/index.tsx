import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { updateReadingStatus } from "#actions/updateReadingStatus";
import { readingStatusMetadata } from "#src/constants/status";
import type { BookType } from "#src/types/book";
import type { ReadingStatus } from "#src/types/readingStatus";
import BookReadingStatusButton, {
  type BookReadingStatusButtonProps,
} from "./ReadingStatusButton";

const order: ReadingStatus[] = ["want_read", "reading", "read"] as const;

export type BookReadingStatusFormProps = {
  status: ReadingStatus;
  onChangeStatus: (status: ReadingStatus) => void;
  optimisticStatus: ReadingStatus;
  onChangeOptimisticStatus: (status: ReadingStatus) => void;
};

type Props = {
  bookId: string;
  bookTitle: string;
  className?: string;
} & BookReadingStatusFormProps &
  Pick<BookReadingStatusButtonProps, "compact">;

export default function BookReadingStatusForm({
  bookId,
  bookTitle,
  status,
  optimisticStatus,
  onChangeOptimisticStatus,
  onChangeStatus,
  compact,
  className,
  ...props
}: Props) {
  // 読書ステータスが変更された
  const changeStatusFormAction = async (formData: FormData) => {
    const newStatus = formData.get("status") as BookType["readingStatus"];

    onChangeOptimisticStatus(newStatus);

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

      onChangeOptimisticStatus(status);

      return;
    }

    onChangeStatus(result.book.readingStatus);
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
