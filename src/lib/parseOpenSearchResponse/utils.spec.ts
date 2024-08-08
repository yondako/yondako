import { describe, expect, test } from "bun:test";
import { createAuthors, createThumbnailUrl } from "./utils";

describe("createThumbnailUrl", () => {
  test("作成できる", () => {
    const got = createThumbnailUrl("978-4-906649-00-6");

    expect(got).toBe("https://ndlsearch.ndl.go.jp/thumbnail/9784906649006.jpg");
  });

  test("空ならundefinedが返る", () => {
    expect(createThumbnailUrl(undefined)).toBeUndefined();
  });
});

describe("createAuthors", () => {
  const testList = [
    {
      title: "カンマ区切り文字列の場合",
      value: "白菊ほたる, 鷹富士茄子",
      want: ["白菊ほたる", "鷹富士茄子"],
    },
    {
      title: "配列の場合",
      value: ["白菊ほたる", "鷹富士茄子"],
      want: ["白菊ほたる", "鷹富士茄子"],
    },
    {
      title: "苗字と名前を区切っているカンマが含まれない",
      value: ["白菊, ほたる", "鷹富士, 茄子"],
      want: ["白菊 ほたる", "鷹富士 茄子"],
    },
    {
      title: "重複が排除される",
      value: [
        "白菊ほたる",
        "鷹富士茄子",
        "白菊ほたる",
        "鷹富士茄子",
        "白菊ほたる",
      ],
      want: ["白菊ほたる", "鷹富士茄子"],
    },
  ];

  for (const { title, value, want } of testList) {
    test(title, () => {
      const got = createAuthors(value);
      expect(got).toEqual(want);
    });
  }

  const texts = [
    "2024-",
    ", 2024-",
    "2023-2024",
    ", 2023-2024",
    "pub. 2024",
    ", pub. 2024",
    "(2024年)",
    ", (2024年)",
  ];

  for (const text of texts) {
    test(`不要な文字列が含まれていない: ${text}`, () => {
      const got = createAuthors(["白菊ほたる", text, "鷹富士茄子"]);

      expect(got).toEqual(["白菊ほたる", "鷹富士茄子"]);
    });
  }

  test("空の値ならundefinedが返る", () => {
    expect(createAuthors(undefined)).toBeUndefined();
  });
});

describe("createPublishers", () => {
  const testList = [
    {
      title: "カンマ区切り文字列の場合",
      value: "ほげほげ, ふがふが",
      want: ["ほげほげ", "ふがふが"],
    },
    {
      title: "配列の場合",
      value: ["ほげほげ", "ふがふが"],
      want: ["ほげほげ", "ふがふが"],
    },
    {
      title: "重複が排除される",
      value: [
        "ほげほげ",
        "ふがふが",
        "ふがふが",
        "ほげほげ",
        "ふがふが",
        "ほげほげ",
      ],
      want: ["ほげほげ", "ふがふが"],
    },
  ];

  for (const { title, value, want } of testList) {
    test(title, () => {
      const got = createAuthors(value);
      expect(got).toEqual(want);
    });
  }

  test("空の値ならundefinedが返る", () => {
    expect(createAuthors(undefined)).toBeUndefined();
  });
});
