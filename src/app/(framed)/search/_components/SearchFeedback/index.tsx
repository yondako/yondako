"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loading } from "@/components/Loading";

export const SEARCH_MESSAGES: Array<[number, string]> = [
  [0, "検索しています"],
  [3000, "がんばって検索しています"],
  [6000, "時間がかかっています……"],
] as const;

const SearchFeedbackContext = createContext<{
  startedAt: number | null;
  start: () => void;
  finish: () => void;
} | null>(null);

export function SearchFeedbackProvider({ children }: { children: ReactNode }) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const start = useCallback(() => {
    setStartedAt(performance.now());
  }, []);
  const finish = useCallback(() => setStartedAt(null), []);

  return (
    <SearchFeedbackContext.Provider value={{ startedAt, start, finish }}>{children}</SearchFeedbackContext.Provider>
  );
}

export function useSearchStart() {
  return useContext(SearchFeedbackContext)?.start;
}

export function SearchFormStatus() {
  const { pending } = useFormStatus();
  const finish = useContext(SearchFeedbackContext)?.finish;

  useEffect(() => {
    if (!pending) {
      finish?.();
    }
  }, [pending, finish]);

  return null;
}

export function SearchLoading() {
  const context = useContext(SearchFeedbackContext);
  // フォームの送信待ちが終わっても、Suspense側では同じ開始時刻で表示を続ける。
  const [initialStartedAt] = useState(() => context?.startedAt ?? performance.now());
  const startedAt = context?.startedAt ?? initialStartedAt;
  const [message, setMessage] = useState(SEARCH_MESSAGES[0][1]);

  useEffect(() => {
    const elapsed = performance.now() - startedAt;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (const [after, text] of SEARCH_MESSAGES) {
      const remaining = after - elapsed;

      if (remaining <= 0) {
        setMessage(text);
      } else {
        timers.push(setTimeout(() => setMessage(text), remaining));
      }
    }

    return () => timers.forEach(clearTimeout);
  }, [startedAt]);

  return (
    <output className="flex flex-1 items-center justify-center" aria-live="polite">
      <Loading className="h-auto" title={message} />
    </output>
  );
}

export function SearchResults({ children }: { children: ReactNode }) {
  const pending = useContext(SearchFeedbackContext)?.startedAt != null;
  return (
    <>
      {pending && <SearchLoading />}
      {/* 新しい結果をマウントできるよう、遷移中も子の描画は継続する。 */}
      <div hidden={pending} className="flex flex-1 flex-col">
        {children}
      </div>
    </>
  );
}
