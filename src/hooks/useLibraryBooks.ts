import { getLibraryBooks } from "@/actions/getLibraryBooks";
import type { Order } from "@/types/order";
import type { ReadingStatus } from "@/types/readingStatus";
import useSWR, { mutate } from "swr";

export type UseLibraryBooksOptions = {
  status: ReadingStatus;
  page: number;
  pageSize: number;
  order: Order;
  titleKeyword?: string;
};

/**
 * ライブラリを取得
 * @param options 検索条件
 * @return ライブラリの書籍データ
 */
export function useLibraryBooks(options: UseLibraryBooksOptions) {
  const key = `library-${options.status}-${options.page}-${options.order}-${options.titleKeyword || "all"}`;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => {
      const result = await getLibraryBooks(options);

      console.log("👍 getLibraryBooks result", result);

      if ("error" in result) {
        throw new Error(result.error);
      }

      return result;
    },
    {
      dedupingInterval: 1000 * 30,
      errorRetryCount: 2,
    },
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

/**
 * 特定のステータスのライブラリキャッシュを再検証
 * @param status 対象の読書ステータス
 */
export function revalidateLibraryCache(status: ReadingStatus) {
  mutate(
    (key) => typeof key === "string" && key.startsWith(`library-${status}-`),
    async (currentData) => currentData,
    { revalidate: true },
  );
}
