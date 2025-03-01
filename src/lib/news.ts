import { site } from "@/constants/site";
import { number, object, parse } from "valibot";

export const latestTimestampSchema = object({
  timestamp: number(),
});

/**
 * 最新のお知らせがあるか確認する
 * @returns 最新のお知らせのタイムスタンプ
 */
export async function checkLatestNews(fetch = global.fetch): Promise<number> {
  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), 3000);

  try {
    const endpoint = new URL(
      "/api/news/latest-timestamp.json",
      site.infoUrl,
    ).toString();

    const res = await fetch(endpoint, {
      signal: ctrl.signal,
      next: {
        revalidate: 60,
      },
    });

    clearTimeout(timeoutId);

    const json = await res.json();

    return parse(latestTimestampSchema, json).timestamp;
  } catch (e) {
    console.error("最新のお知らせの確認に失敗", e);
    return 0;
  }
}
