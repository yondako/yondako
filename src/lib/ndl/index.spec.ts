import { describe, expect, mock, test } from "bun:test";
import {
  createDummyBookDetail,
  createDummyItem,
  createDummyXml,
} from "#src/_mocks/book";
import { searchBooksFromNDL } from "./index";

describe("searchBooksFromNDL", () => {
  test("正常に書籍を検索できること", async () => {
    const mockFetch = mock().mockResolvedValue({
      text: mock().mockResolvedValue(
        createDummyXml(10, createDummyItem("000000000")),
      ),
    });

    const opts = { cnt: 10, any: "JavaScript" };
    const result = await searchBooksFromNDL(opts, mockFetch);

    expect(result).toEqual({
      meta: {
        totalResults: 10,
        startIndex: 1,
        itemsPerPage: 10,
      },
      books: [createDummyBookDetail("000000000")],
    });
  });

  test("エラーが発生した場合はundefinedを返すこと", async () => {
    const mockFetch = mock().mockRejectedValue(new Error("fetch error"));

    const opts = { cnt: 10, any: "JavaScript" };
    const result = await searchBooksFromNDL(opts, mockFetch);

    expect(result).toBeUndefined();
  });
});
