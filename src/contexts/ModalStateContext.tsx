"use client";

import type { LibraryRevalidationData } from "@/hooks/useLibraryBooks";
import { type ReactNode, createContext, useContext, useRef, useState } from "react";

type ModalStateContextType = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;

  /**
   * 再検証を保留する対象を追加
   */
  addPendingRevalidation: (data: LibraryRevalidationData) => void;

  /**
   * 保留中の再検証
   */
  executePendingRevalidations: () => LibraryRevalidationData[];

  /**
   * 保留中の再検証をクリア
   */
  clearPendingRevalidations: () => void;
};

const ModalStateContext = createContext<ModalStateContextType | undefined>(undefined);

export function ModalStateProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pendingRevalidationsRef = useRef(new Set<LibraryRevalidationData>());

  const addPendingRevalidation = (data: LibraryRevalidationData) => {
    pendingRevalidationsRef.current.add(data);
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
