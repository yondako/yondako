import { expect, mock, test } from "bun:test";
import { fetchRecentNews } from "./fetchRecentNews";

test("正常に直近のお知らせを取得できること", async () => {
  const mockNews = [
    {
      slug: "news-1",
      title: "お知らせ1",
      emoji: "📢",
      tags: ["tag1", "tag2"],
      publishedAt: "2023-10-01",
    },
  ];

  const mockFetch = mock().mockResolvedValue({
    ok: true,
    json: mock().mockResolvedValue(mockNews),
  });

  const result = await fetchRecentNews(mockFetch);
  expect(result).toEqual(mockNews);
});

test("HTTPエラーが発生した場合、エラーを投げる", () => {
  const mockFetch = mock().mockResolvedValue({
    ok: false,
    status: 500,
    statusText: "Internal Server Error",
  });

  const result = fetchRecentNews(mockFetch);
  expect(result).rejects.toThrow("HTTP error: 500");
});

test("無効なデータが返された場合、エラーを投げる", () => {
  const invalidData = { invalid: "data" };
  const mockFetch = mock().mockResolvedValue({
    ok: true,
    json: mock().mockResolvedValue(invalidData),
  });

  const result = fetchRecentNews(mockFetch);
  expect(result).rejects.toThrowError();
});
