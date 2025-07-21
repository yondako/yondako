import useSWR from "swr";
import { checkLatestNews } from "@/lib/news";

/**
 * 最新のお知らせタイムスタンプを取得
 */
export function useLatestNews() {
  const { data, error, isLoading } = useSWR("latest-news-timestamp", () => checkLatestNews(), {
    // お知らせは頻繁に更新されないので長めのキャッシュ
    dedupingInterval: 1000 * 60 * 30, // 30分間
    errorRetryCount: 2,
  });

  return {
    latestNewsTimestamp: data ?? 0,
    error,
    isLoading,
  };
}
