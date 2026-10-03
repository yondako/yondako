import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";
import { createDummyBookDetail, createDummyItem, createDummyXml } from "@/_mocks/book";
import { normalizeIsbn } from "../isbn";
import { findBookByIsbn, searchBooksFromNDL } from ".";

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
    const mockFetch = mock().mockResolvedValue({ ok: false, status: 500, text });
    expect(await searchBooksFromNDL({ limit: 1 }, mockFetch)).toBeUndefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(text).not.toHaveBeenCalled();
  });

  test("429の場合は再試行して結果を返す", async () => {
    const mockFetch = mock()
      .mockResolvedValueOnce({ ok: false, status: 429, headers: new Headers({ "Retry-After": "0" }) })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: mock().mockResolvedValue(createDummyXml(10, createDummyItem("000000000"))),
      });

    const result = await searchBooksFromNDL({ limit: 10 }, mockFetch);

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result?.books).toEqual([createDummyBookDetail("000000000")]);
  });

  test("429が続く場合は再試行を打ち切る", async () => {
    const text = mock();
    const mockFetch = mock().mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers({ "Retry-After": "0" }),
      text,
    });

    expect(await searchBooksFromNDL({ limit: 1 }, mockFetch)).toBeUndefined();
    expect(mockFetch).toHaveBeenCalledTimes(3);
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

describe("findBookByIsbn", () => {
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

  const targetIsbn = normalizeIsbn(createDummyBookDetail("000000002").isbn) ?? "";

  const createMockFetch = (children: string) =>
    mock().mockResolvedValue({
      ok: true,
      status: 200,
      text: mock().mockResolvedValue(createDummyXml(2, children)),
    });

  test("ISBNが一致する書籍を返す", async () => {
    // 1件目は別の書籍の誤ったISBNにヒットした結果を想定
    const mockFetch = createMockFetch(createDummyItem("000000001") + createDummyItem("000000002"));

    const result = await findBookByIsbn(targetIsbn, mockFetch);

    expect(new URL(mockFetch.mock.calls[0][0]).searchParams.get("isbn")).toBe(targetIsbn);
    expect(result).toEqual(createDummyBookDetail("000000002"));
  });

  test("ISBNが一致する書籍が無い場合はundefinedを返す", async () => {
    const mockFetch = createMockFetch(createDummyItem("000000001"));

    expect(await findBookByIsbn(targetIsbn, mockFetch)).toBeUndefined();
  });
});
