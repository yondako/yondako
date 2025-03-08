import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import {
  createDummyBookDetail,
  createDummyItem,
  createDummyXml,
} from "@/_mocks/book";
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
      text: mock().mockResolvedValue(
        createDummyXml(10, createDummyItem("000000000")),
      ),
    });

    const opts = {
      count: 10,
      params: {
        any: "JavaScript",
      },
    };

    const result = await searchBooksFromNDL(opts, mockFetch);

    expect(result).toEqual({
      meta: {
        totalResults: 1,
      },
      books: [createDummyBookDetail("000000000")],
    });
  });

  test("エラーが発生した場合はundefinedを返すこと", async () => {
    const mockFetch = mock().mockRejectedValue(new Error("fetch error"));

    const opts = {
      count: 10,
      params: {
        any: "JavaScript",
      },
    };

    const result = await searchBooksFromNDL(opts, mockFetch);

    expect(result).toBeUndefined();
  });
});
