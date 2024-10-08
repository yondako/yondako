import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const lastNewsCheckedKey = "lastNewsChecked";

/**
 * 新着のお知らせがあるかどうか
 * @param latestNewsTimestamp 最新のお知らせのタイムスタンプ
 * @returns あればtrue
 */
export const useCheckLatestNews = (latestNewsTimestamp: number): boolean => {
  const [hasNewNews, setHasNewNews] = useState(false);
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const rawPrev = localStorage.getItem(lastNewsCheckedKey);
    const prevNewsCheckedTimestamp = rawPrev ? Number.parseInt(rawPrev) : 0;

    setHasNewNews(latestNewsTimestamp > prevNewsCheckedTimestamp);
  }, [latestNewsTimestamp, pathname]);

  return hasNewNews;
};
