import { useCallback } from "react";
import { updateReadingStatus } from "@/actions/updateReadingStatus";
import type { BookIdentifiers } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import { useLibraryCacheRevalidation } from "./useLibraryBooks";

/**
 * 読書ステータスを更新
 */
export function useUpdateReadingStatus() {
  const { revalidateLibraryCache } = useLibraryCacheRevalidation();

  const updateReadingStatusWithCache = useCallback(
    async (bookIdentifiers: BookIdentifiers, newStatus: ReadingStatus, previousStatus?: ReadingStatus) => {
      const result = await updateReadingStatus(bookIdentifiers, newStatus);

      if (!result.error && result.book) {
        // 新しい読書ステータスのライブラリのキャッシュを再検証
        if (newStatus !== "none") {
          revalidateLibraryCache({
            status: newStatus,
            action: "add",
          });
        }

        // 以前の読書ステータスのキャッシュも再検証
        if (previousStatus && previousStatus !== "none" && previousStatus !== newStatus) {
          revalidateLibraryCache({
            status: previousStatus,
            action: "remove",
          });
        }
      }

      return result;
    },
    [revalidateLibraryCache],
  );

  return { updateReadingStatusWithCache };
}
