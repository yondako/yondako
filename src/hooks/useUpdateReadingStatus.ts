import { updateReadingStatus } from "@/actions/updateReadingStatus";
import type { BookIdentifiers } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import { useCallback } from "react";
import { revalidateLibraryCache } from "./useLibraryBooks";

/**
 * 読書ステータスを更新
 */
export function useUpdateReadingStatus() {
  const updateReadingStatusWithCache = useCallback(
    async (bookIdentifiers: BookIdentifiers, newStatus: ReadingStatus, previousStatus?: ReadingStatus) => {
      const result = await updateReadingStatus(bookIdentifiers, newStatus);

      // 成功した場合、関連するキャッシュを古いものとしてマーク
      if (!result.error && result.book) {
        // 新しいステータスのキャッシュをマーク
        if (newStatus !== "none") {
          revalidateLibraryCache(newStatus);
        }

        // 以前のステータスのキャッシュもマーク
        if (previousStatus && previousStatus !== "none" && previousStatus !== newStatus) {
          revalidateLibraryCache(previousStatus);
        }
      }

      return result;
    },
    [],
  );

  return { updateReadingStatusWithCache };
}
