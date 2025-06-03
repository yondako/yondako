import { readingStatusMetadata } from "@/constants/status";
import type { BookIdentifiers, BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { updateReadingStatus } from "#actions/updateReadingStatus";
import BookReadingStatusButton, { type BookReadingStatusButtonProps } from "./ReadingStatusButton";

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
} & BookReadingStatusFormProps &
  Pick<BookReadingStatusButtonProps, "compact">;

/**
 * 本の読書ステータス（よみたい・読書中・読みおわった）を変更するためのフォームコンポーネント。各ステータスボタンをクリックして変更し、オプティミスティック更新でスムーズな操作を実現します。
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
  ...props
}: Props) {
  // 読書ステータスが変更された
  const changeStatusFormAction = async (formData: FormData) => {
    const newStatus = formData.get("status") as BookType["readingStatus"];

    onChangeOptimisticStatus(newStatus);

    const result = await updateReadingStatus(identifiers, newStatus);

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
