"use client";

import type { ReadingStatus } from "@/types/readingStatus";
import { type ReactNode, createContext, useContext, useRef, useState } from "react";

type ModalStateContextType = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;

  /**
   * 再検証を保留する対象の読書ステータスを追加
   * @param status 対象の読書ステータス
   */
  addPendingRevalidation: (status: ReadingStatus) => void;

  /**
   * 保留中の再検証を実行
   * @returns 実行した対象の読書ステータスの配列
   */
  executePendingRevalidations: () => ReadingStatus[];

  /**
   * 保留中の再検証をクリア
   */
  clearPendingRevalidations: () => void;
};

const ModalStateContext = createContext<ModalStateContextType | undefined>(undefined);

export function ModalStateProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pendingRevalidationsRef = useRef(new Set<ReadingStatus>());

  const addPendingRevalidation = (status: ReadingStatus) => {
    pendingRevalidationsRef.current.add(status);
  };

  const executePendingRevalidations = () => {
    const statuses = Array.from(pendingRevalidationsRef.current);

    pendingRevalidationsRef.current.clear();

    return statuses;
  };

  const clearPendingRevalidations = () => {
    pendingRevalidationsRef.current.clear();
  };

  return (
    <ModalStateContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        addPendingRevalidation,
        executePendingRevalidations,
        clearPendingRevalidations,
      }}
    >
      {children}
    </ModalStateContext.Provider>
  );
}

export function useModalState() {
  const context = useContext(ModalStateContext);

  if (!context) {
    throw new Error("useModalStateはModalStateProviderのなかでのみ使用できます！");
  }

  return context;
}
