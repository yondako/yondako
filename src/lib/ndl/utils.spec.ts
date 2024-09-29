import { describe, expect, test } from "bun:test";
import {
  createAuthors,
  createPublishers,
  getJpeCode,
  toStringOrUndefined,
} from "./utils";

describe("toStringOrUndefined", () => {
  test("numberがstringに変換できる", () => {
    expect(toStringOrUndefined(12345)).toBe("12345");
  });

  test("stringはそのまま返る", () => {
    expect(toStringOrUndefined("abcd")).toBe("abcd");
  });

  test("undefinedはそのまま返る", () => {
    expect(toStringOrUndefined(undefined)).toBeUndefined();
  });
});

describe("getJpeCode", () => {
  test("JP-eコードを正常に取得できること", () => {
    const urls = [
      "https://www.books.or.jp/book-details/12345678901234567890",
      "https://example.com/other-url",
    ];

    const result = getJpeCode(urls);
    expect(result).toBe("12345678901234567890");
  });

  test("JP-eコードが含まれていない場合はundefinedを返すこと", () => {
    const urls = [
      "https://example.com/other-url",
      "https://another-example.com/another-url",
    ];

    const result = getJpeCode(urls);
    expect(result).toBeUndefined();
  });

  test("undefinedが含まれている場合でもJP-eコードを正常に取得できること", () => {
    const urls = [
      undefined,
      "https://www.books.or.jp/book-details/09876543210987654321",
    ];

    const result = getJpeCode(urls);
    expect(result).toBe("09876543210987654321");
  });
});

describe("createAuthors", () => {
  const testList = [
    {
      title: "苗字と名前がカンマで区切られている場合",
      value: "苗字, 名前",
      want: ["苗字 名前"],
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
      const got = createPublishers(value);
      expect(got).toEqual(want);
    });
  }

  test("空の値ならundefinedが返る", () => {
    expect(createAuthors(undefined)).toBeUndefined();
  });
});
