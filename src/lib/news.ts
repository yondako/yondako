import { site } from "@/constants/site";
import { number, object, parse } from "valibot";

export const latestTimestampSchema = object({
  timestamp: number(),
});

/**
 * 最新のお知らせがあるか確認する
 * @returns 最新のお知らせのタイムスタンプ
 */
export async function checkLatestNews(): Promise<number> {
  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), 3000);

  try {
    const endpoint = new URL(
      "/api/news/latest-timestamp.json",
      site.infoUrl,
    ).toString();

    const res = await fetch(endpoint, {
      cache: "no-store",
      signal: ctrl.signal,
    });

    clearTimeout(timeoutId);

    const json = await res.json();

    return parse(latestTimestampSchema, json).timestamp;
  } catch (e) {
    console.error("最新のお知らせの確認に失敗", e);
    return 0;
  }
}

export const lastNewsCheckedAtKey = "lastNewsCheckedAt";

/**
 * 新着のお知らせがあるかどうか
 * @param latestNewsTimestamp 最新のお知らせのタイムスタンプ
 * @returns あればtrue
 */
export const checkForNewNews = (latestNewsTimestamp: number): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const rawPrev = localStorage.getItem(lastNewsCheckedAtKey);
  const prevNewsCheckedTimestamp = rawPrev ? Number.parseInt(rawPrev) : 0;

  return latestNewsTimestamp > prevNewsCheckedTimestamp;
};
