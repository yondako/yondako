import { toast } from "@/components/Toast";
import { readingStatusMetadata } from "@/constants/status";
import type { BookIdentifiers } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import { startTransition } from "react";
import type { useUpdateReadingStatus } from "#hooks/useUpdateReadingStatus";
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

    const previousStatusLabel =
      previousStatus !== "none"
        ? `「${readingStatusMetadata.get(previousStatus)?.label}」にもどしました`
        : "登録を解除しました";

    const newStatusLabel =
      newStatus !== "none" ? `「${readingStatusMetadata.get(newStatus)?.label}」に登録しました` : "登録を解除しました";

    toast.success(newStatusLabel, {
      description: bookTitle,
      action: {
        label: "取り消す",
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
          toast.success(previousStatusLabel);
        },
      },
    });
  };
}
