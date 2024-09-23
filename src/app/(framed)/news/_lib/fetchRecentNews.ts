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
export const fetchRecentNews = async () => {
  const res = await fetch("https://info.yondako.com/api/news/recent.json", {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  const json = await res.json();

  return parse(newsSchema, json);
};
