import { describe, expect, test } from "bun:test";
import { ReadonlyURLSearchParams } from "next/navigation";
import {
  createFilterSearchParams,
  removeKeywordParam,
} from "./filterSearchParams";

describe("createFilterSearchParams", () => {
  const tests = [
    {
      title: "すべてのパラメータが正しく結合される",
      searchParams: new ReadonlyURLSearchParams(),
      args: ["keyword", "asc"],
      want: "?q=keyword&order=asc",
    },
    {
      title: "キーワードのみ",
      searchParams: new ReadonlyURLSearchParams(),
      args: ["keyword"],
      want: "?q=keyword",
    },
    {
      title: "ソート順のみ",
      searchParams: new ReadonlyURLSearchParams(),
      args: [undefined, "desc"],
      want: "?order=desc",
    },
    {
      title: "既にあるパラメータはそのまま残る",
      searchParams: new ReadonlyURLSearchParams({
        q: "keyword",
      }),
      args: [undefined, "asc"],
      want: "?q=keyword&order=asc",
    },
  ];

  for (const { title, searchParams, args, want } of tests) {
    test(title, () => {
      expect(createFilterSearchParams(searchParams, ...args)).toBe(want);
    });
  }
});

describe("removeKeywordParam", () => {
  test("qパラメータが消える", () => {
    expect(
      removeKeywordParam(
        new ReadonlyURLSearchParams({
          q: "keyword",
          order: "desc",
        }),
      ),
    ).toBe("?order=desc");
  });
});
