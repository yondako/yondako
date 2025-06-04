import { getLibraryBooks } from "@/actions/getLibraryBooks";
import { useLibraryRevalidation } from "@/contexts/LibraryRevalidationContext";
import { useModalState } from "@/contexts/ModalStateContext";
import type { BookType } from "@/types/book";
import type { Order } from "@/types/order";
import type { ReadingStatus } from "@/types/readingStatus";
import { useEffect, useRef } from "react";
import useSWR, { mutate } from "swr";

export const BOOK_SKELETON = undefined;

export type LibraryBooksData = {
  books: (BookType | typeof BOOK_SKELETON)[];
  total: number;
};

export type LibraryRevalidationData = {
  status: ReadingStatus;
  action: "add" | "remove";
};

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

  const { data, error, isLoading } = useSWR<LibraryBooksData>(
    key,
    async () => {
      const result = await getLibraryBooks(options);

      console.log("👍 getLibraryBooks result", result);

      if ("error" in result) {
        throw new Error(result.error);
      }

      return { books: result.books, total: result.total };
    },
    {
      dedupingInterval: 1000 * 60 * 5, // 5分間キャッシュ
      errorRetryCount: 2,
    },
  );

  return {
    data,
    error,
    isLoading,
  };
}

/**
 * ライブラリキャッシュを即座に再検証
 * @param status 対象の読書ステータス
 */
export function revalidateLibraryCacheImmediate({ status, action }: LibraryRevalidationData) {
  mutate(
    (key) => typeof key === "string" && key.startsWith(`library-${status}-`),
    async (data: LibraryBooksData | undefined) => {
      // データが存在しない or 削除のときはそのまま
      if (!data || action === "remove") {
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
  const { isModalOpen } = useModalState();
  const { addPendingRevalidation } = useLibraryRevalidation();

  /**
   * @param data ライブラリ再検証データ
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
  const { setIsModalOpen } = useModalState();
  const { executePendingRevalidations } = useLibraryRevalidation();

  // refを使用して最新の関数への参照を保持
  const executePendingRevalidationsRef = useRef(executePendingRevalidations);
  const setIsModalOpenRef = useRef(setIsModalOpen);

  // refを更新
  executePendingRevalidationsRef.current = executePendingRevalidations;
  setIsModalOpenRef.current = setIsModalOpen;

  useEffect(() => {
    // コンポーネントがアンマウントされる時に保留中の再検証を実行
    return () => {
      const pendingRevalidations = executePendingRevalidationsRef.current();

      for (const revalidation of pendingRevalidations) {
        revalidateLibraryCacheImmediate(revalidation);
      }

      // モーダル状態もリセット
      setIsModalOpenRef.current(false);
    };
  }, []);
}
