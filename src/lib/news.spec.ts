import { describe, expect, mock, test } from "bun:test";
import { site } from "@/constants/site";
import { checkLatestNews } from "./news";

describe("checkLatestNews", () => {
  test("応答が有効ならタイムスタンプが返る", async () => {
    const mockFetch = mock().mockReturnValue({
      json: mock().mockResolvedValue({
        timestamp: 1627849200,
      }),
    });

    const result = await checkLatestNews(mockFetch);

    expect(result).toBe(1627849200);

    expect(mockFetch).toHaveBeenCalledWith(
      new URL("/api/news/latest-timestamp.json", site.infoUrl).toString(),
      {
        next: { revalidate: 0 },
        signal: expect.any(AbortSignal),
      },
    );
  });

  test("エラーが投げられたら0が返る", async () => {
    const mockFetch = mock().mockRejectedValue(new Error("Fetch failed"));
    const result = await checkLatestNews(mockFetch);

    expect(result).toBe(0);

    expect(mockFetch).toHaveBeenCalledWith(
      new URL("/api/news/latest-timestamp.json", site.infoUrl).toString(),
      {
        next: { revalidate: 0 },
        signal: expect.any(AbortSignal),
      },
    );
  });

  test("応答が無効なら0が返る", async () => {
    const mockFetch = mock().mockResolvedValue({
      json: mock().mockResolvedValue({ invalid: "data" }),
    });

    const result = await checkLatestNews(mockFetch);

    expect(result).toBe(0);

    expect(mockFetch).toHaveBeenCalledWith(
      new URL("/api/news/latest-timestamp.json", site.infoUrl).toString(),
      {
        next: { revalidate: 0 },
        signal: expect.any(AbortSignal),
      },
    );
  });
});
