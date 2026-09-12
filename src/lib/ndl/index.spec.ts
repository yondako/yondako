import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";
import { createDummyBookDetail, createDummyItem, createDummyXml } from "@/_mocks/book";
import { searchBooksFromNDL } from ".";

describe("searchBooksFromNDL", () => {
  beforeEach(() => {
    mock.module("next/cache", () => {
      return {
        unstable_cache: (fn: () => void) => fn,
      };
    });
  });

  afterEach(() => {
    mock.restore();
  });

  test("書籍を検索できる", async () => {
    const mockFetch = mock().mockResolvedValue({
      ok: true,
      text: mock().mockResolvedValue(createDummyXml(10, createDummyItem("000000000"))),
    });

    const opts = {
      limit: 10,
      params: {
        any: "JavaScript",
      },
    };

    const result = await searchBooksFromNDL(opts, mockFetch);

    expect(new URL(mockFetch.mock.calls[0][0]).origin).toBe("https://ndlsearch.ndl.go.jp");

    expect(result).toEqual({
      meta: {
        totalResults: 1,
      },
      books: [createDummyBookDetail("000000000")],
    });
  });

  test("HTTPエラーを検索結果として解析しない", async () => {
    const text = mock();
    const mockFetch = mock().mockResolvedValue({ ok: false, status: 429, text });
    expect(await searchBooksFromNDL({ limit: 1 }, mockFetch)).toBeUndefined();
    expect(text).not.toHaveBeenCalled();
  });

  test.each(["応答待ち", "本文の受信待ち"])("%sを30秒で中断する", async (phase) => {
    const timeout = AbortSignal.timeout.bind(AbortSignal);
    const timeoutSpy = spyOn(AbortSignal, "timeout").mockImplementation(() => timeout(1));
    const mockFetch = mock(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const wait = () =>
        new Promise<never>((_, reject) => {
          init?.signal?.addEventListener("abort", () => reject(init.signal?.reason), { once: true });
        });
      if (phase === "応答待ち") return wait();
      return { ok: true, text: wait } as unknown as Response;
    });

    expect(await searchBooksFromNDL({ limit: 1 }, mockFetch)).toBeUndefined();
    expect(timeoutSpy).toHaveBeenCalledWith(30_000);
  });

  test("エラーが発生した場合はundefinedを返すこと", async () => {
    const mockFetch = mock().mockRejectedValue(new Error("fetch error"));

    const opts = {
      limit: 10,
      params: {
        any: "JavaScript",
      },
    };

    const result = await searchBooksFromNDL(opts, mockFetch);

    expect(result).toBeUndefined();
  });
});
