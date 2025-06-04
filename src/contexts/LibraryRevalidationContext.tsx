"use client";

import type { LibraryRevalidationData } from "@/hooks/useLibraryBooks";
import { type ReactNode, createContext, useContext, useRef } from "react";

type LibraryRevalidationContextType = {
  /**
   * 再検証を保留する対象を追加
   */
  addPendingRevalidation: (data: LibraryRevalidationData) => void;

  /**
   * 保留中の再検証を実行して配列を返す
   */
  executePendingRevalidations: () => LibraryRevalidationData[];

  /**
   * 保留中の再検証をクリア
   */
  clearPendingRevalidations: () => void;
};

const LibraryRevalidationContext = createContext<LibraryRevalidationContextType | undefined>(undefined);

export function LibraryRevalidationProvider({ children }: { children: ReactNode }) {
  const pendingRevalidationsRef = useRef(new Set<LibraryRevalidationData>());

  const addPendingRevalidation = (data: LibraryRevalidationData) => {
    pendingRevalidationsRef.current.add(data);
  };

  const executePendingRevalidations = () => {
    const revalidations = Array.from(pendingRevalidationsRef.current);
    pendingRevalidationsRef.current.clear();
    return revalidations;
  };

  const clearPendingRevalidations = () => {
    pendingRevalidationsRef.current.clear();
  };

  return (
    <LibraryRevalidationContext.Provider
      value={{
        addPendingRevalidation,
        executePendingRevalidations,
        clearPendingRevalidations,
      }}
    >
      {children}
    </LibraryRevalidationContext.Provider>
  );
}

export function useLibraryRevalidation() {
  const context = useContext(LibraryRevalidationContext);
  if (!context) {
    throw new Error("⚠️ useLibraryRevalidation must be used within a LibraryRevalidationProvider");
  }
  return context;
}
