import { startTransition } from "react";
import type { useUpdateReadingStatus } from "#hooks/useUpdateReadingStatus";
import { toast } from "@/components/Toast";
import { readingStatusMetadata } from "@/constants/status";
import type { BookIdentifiers } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import type { BookReadingStatusFormProps } from ".";

export type UndoToastOptions = {
  identifiers: BookIdentifiers;
  updateReadingStatusWithCache: ReturnType<typeof useUpdateReadingStatus>["updateReadingStatusWithCache"];
} & Pick<BookReadingStatusFormProps, "onChangeOptimisticStatus" | "onChangeStatus">;

/**
 * ライブラリページでのみ取り消しトーストを表示
 */
export function createUndoToast({
  identifiers,
  updateReadingStatusWithCache,
  onChangeOptimisticStatus,
  onChangeStatus,
}: UndoToastOptions) {
  return (pathname: string | null, previousStatus: ReadingStatus, newStatus: ReadingStatus, bookTitle: string) => {
    // ライブラリページ以外では表示しない
    if (!pathname?.startsWith("/library/")) {
      return;
    }

    const newStatusLabel =
      newStatus !== "none"
        ? `"${readingStatusMetadata.get(newStatus)?.label}" に登録しました`
        : "ライブラリから削除しました";

    toast.success(newStatusLabel, {
      description: bookTitle,
      action: {
        label: "元に戻す",
        onClick: async () => {
          // 前のステータスに戻す
          startTransition(() => {
            onChangeOptimisticStatus(previousStatus);
          });

          const undoResult = await updateReadingStatusWithCache(identifiers, previousStatus, newStatus);

          if (undoResult.error || !undoResult.book) {
            toast.error("取り消しに失敗しました", {
              description: undoResult.error ?? "時間をおいてもう一度お試しください",
            });

            // 失敗した場合は戻す
            startTransition(() => {
              onChangeOptimisticStatus(newStatus);
            });

            return;
          }

          onChangeStatus(undoResult.book.readingStatus);
          toast.success("🐙 元に戻しました");
        },
      },
    });
  };
}
