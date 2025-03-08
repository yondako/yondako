import { describe, expect, mock, test } from "bun:test";
import { checkLatestNews } from "./news";

describe("checkLatestNews", () => {
  test("応答が有効ならタイムスタンプが返る", async () => {
    const mockFetch = mock().mockReturnValue({
      json: mock().mockResolvedValue({
        timestamp: 1627849200,
      }),
    });

    const result = await checkLatestNews(mockFetch);

    expect(mockFetch).toHaveBeenCalled();
    expect(result).toBe(1627849200);
  });

  test("エラーが投げられたら0が返る", async () => {
    const mockFetch = mock().mockRejectedValue(new Error("Fetch failed"));
    const result = await checkLatestNews(mockFetch);

    expect(mockFetch).toHaveBeenCalled();
    expect(result).toBe(0);
  });

  test("応答が無効なら0が返る", async () => {
    const mockFetch = mock().mockResolvedValue({
      json: mock().mockResolvedValue({ invalid: "data" }),
    });

    const result = await checkLatestNews(mockFetch);

    expect(mockFetch).toHaveBeenCalled();
    expect(result).toBe(0);
  });
});
