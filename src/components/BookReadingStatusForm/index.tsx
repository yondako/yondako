import { updateReadingStatus } from "@/actions/updateReadingStatus";
import { readingStatusMetadata } from "@/constants/status";
import type { BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
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
  onChangeOptimisticStatus: setOptimisticStatus,
  onChangeStatus,
  compact,
  className,
  ...props
}: Props) {
  // 読書ステータスが変更された
  const changeStatusFormAction = async (formData: FormData) => {
    const newStatus = formData.get("status") as BookType["readingStatus"];

    setOptimisticStatus(newStatus);

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

      setOptimisticStatus(status);

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
