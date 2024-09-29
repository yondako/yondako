import { site } from "@/constants/site";
import { array, object, parse, string } from "valibot";

export const newsSchema = array(
  object({
    slug: string(),
    title: string(),
    emoji: string(),
    tags: array(string()),
    publishedAt: string(),
  }),
);

/**
 * 直近のお知らせを取得する
 */
export const fetchRecentNews = async (fetch = global.fetch) => {
  const url = new URL("/api/news/recent.json", site.infoUrl).toString();
  const res = await fetch(url, {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  const json = await res.json();

  return parse(newsSchema, json);
};
