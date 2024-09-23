export const lastNewsCheckedAtKey = "lastNewsCheckedAt";

/**
 * 新着のお知らせがあるかどうか
 * @param latestNewsPublishedAt 最新のお知らせの公開日時
 * @returns あればtrue
 */
export const checkForNewNews = (latestNewsPublishedAt: number): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const rawPrev = localStorage.getItem(lastNewsCheckedAtKey);
  const prevNewsCheckedAt = rawPrev ? Number.parseInt(rawPrev) : 0;

  return latestNewsPublishedAt > prevNewsCheckedAt;
};
