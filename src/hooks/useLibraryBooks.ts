import { getLibraryBooks } from "@/actions/getLibraryBooks";
import { useModalState } from "@/contexts/ModalStateContext";
import type { Order } from "@/types/order";
import type { ReadingStatus } from "@/types/readingStatus";
import { useEffect, useRef } from "react";
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

export type LibraryRevalidationData = {
  status: ReadingStatus;
  action: "add" | "remove";
};

/**
 * ライブラリキャッシュを即座に再検証
 * @param status 対象の読書ステータス
 */
export function revalidateLibraryCacheImmediate({ status, action }: LibraryRevalidationData) {
  mutate(
    (key) => typeof key === "string" && key.startsWith(`library-${status}-`),
    async (data) => {
      // 削除のときはそのまま返す
      if (action === "remove") {
        return data;
      }

      // 追加のときはそのまま返すとCLSが発生するので、先頭に空を入れる
      // (UI上はスケルトンが表示される)
      return {
        books: [undefined, ...data.books],
        total: data.total + 1,
      };
    },
    { revalidate: true },
  );
}

/**
 * モーダルの状態に応じてキャッシュ再検証を行うフック
 */
export function useLibraryCacheRevalidation() {
  const { isModalOpen, addPendingRevalidation } = useModalState();

  /**
   * @param status 対象の読書ステータス
   * @param type データの更新種別
   */
  const revalidateLibraryCache = (data: LibraryRevalidationData) => {
    if (isModalOpen) {
      // モーダルが開いている場合は保留
      addPendingRevalidation(data);
    } else {
      // モーダルが閉じている場合は即時
      revalidateLibraryCacheImmediate(data);
    }
  };

  return { revalidateLibraryCache };
}

/**
 * ライブラリページのクリーンアップ時に保留中の再検証を実行するフック
 */
export function useLibraryCleanup() {
  const { executePendingRevalidations, setIsModalOpen } = useModalState();

  // refを使用して最新の関数への参照を保持
  const executePendingRevalidationsRef = useRef(executePendingRevalidations);
  const setIsModalOpenRef = useRef(setIsModalOpen);

  // refを更新
  executePendingRevalidationsRef.current = executePendingRevalidations;
  setIsModalOpenRef.current = setIsModalOpen;

  useEffect(() => {
    // コンポーネントがアンマウントされる時に保留中の再検証を実行
    return () => {
      const pendingStatuses = executePendingRevalidationsRef.current();

      for (const status of pendingStatuses) {
        revalidateLibraryCacheImmediate(status);
      }

      // モーダル状態もリセット
      setIsModalOpenRef.current(false);
    };
  }, []);
}
