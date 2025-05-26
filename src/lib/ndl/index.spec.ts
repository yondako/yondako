import { describe, expect, mock, test } from "bun:test";
import {
  createDummyBookDetail,
  createDummyItem,
  createDummyXml,
} from "@/_mocks/book";
import { searchBooksFromNDL } from ".";

describe("searchBooksFromNDL", () => {
  test("書籍を検索できる", async () => {
    const mockFetch = mock().mockResolvedValue(
      new Response(createDummyXml(1, createDummyItem("000000000")), {
        status: 200,
        headers: { "Content-Type": "application/xml" },
      }),
    );
    // Corrected mock: unstable_cache returns a function, 
    // which when called, executes fn and returns its Promise.
    const mockUnstableCache = (fn: () => Promise<any>) => () => fn(); 

    const opts = {
      count: 10,
      params: {
        any: "JavaScript",
      },
    };
    // searchBooksFromNDL の第3引数にモックを渡す
    const result = await searchBooksFromNDL(opts, mockFetch, mockUnstableCache);

    expect(result).toEqual({
      meta: {
        totalResults: 1,
      },
      books: [createDummyBookDetail("000000000")],
    });
  });

  test("エラーが発生した場合はundefinedを返すこと", async () => {
    const mockFetch = mock().mockRejectedValue(new Error("fetch error"));
    // Corrected mock: unstable_cache returns a function, 
    // which when called, executes fn and returns its Promise.
    const mockUnstableCache = (fn: () => Promise<any>) => () => fn(); 

    const opts = {
      count: 10,
      params: {
        any: "JavaScript",
      },
    };
    // searchBooksFromNDL の第3引数にモックを渡す
    const result = await searchBooksFromNDL(opts, mockFetch, mockUnstableCache);

    expect(result).toBeUndefined();
  });
});
