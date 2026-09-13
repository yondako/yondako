import { describe, expect, test } from "bun:test";
import { ReadonlyURLSearchParams } from "next/navigation";
import { createFilterSearchParams, removeKeywordParam } from "./filterSearchParams";

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
      title: "2ページ目から検索するとページ指定をリセットし並び順を保持する",
      searchParams: new ReadonlyURLSearchParams({ page: "2", order: "asc" }),
      args: ["黄金色"],
      want: `?order=asc&q=${encodeURIComponent("黄金色")}`,
    },
    {
      title: "検索キーワードを変更するとページ指定をリセットする",
      searchParams: new ReadonlyURLSearchParams({ page: "3", q: "keyword" }),
      args: ["new"],
      want: "?q=new",
    },
    {
      title: "並び順のみの変更ではページ指定を保持する",
      searchParams: new ReadonlyURLSearchParams({ page: "2", q: "keyword" }),
      args: [undefined, "asc"],
      want: "?page=2&q=keyword&order=asc",
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
  test("検索解除時にページ指定をリセットし並び順を保持する", () => {
    expect(removeKeywordParam(new ReadonlyURLSearchParams({ page: "2", q: "keyword", order: "asc" }))).toBe(
      "?order=asc",
    );
  });

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
