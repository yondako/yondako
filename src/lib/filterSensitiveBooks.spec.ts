import { describe, expect, test } from "bun:test";
import { createDummyBookDetail } from "@/_mocks/book";
import { filterSensitiveBooks } from "./filterSensitiveBooks";

describe("filterNGWords", () => {
  test("NGワードを含むタイトルが間引かれる", async () => {
    const ngWords = ["にゃーん", "ネコ"];
    const books = [
      {
        ...createDummyBookDetail("0"),
        title: "これはセーフ",
      },
      {
        ...createDummyBookDetail("1"),
        title: "にゃーんと鳴いた",
      },
      {
        ...createDummyBookDetail("2"),
        title: "これも大丈夫",
      },
      {
        ...createDummyBookDetail("3"),
        title: "ネコと和解せよ",
      },
    ];

    const result = filterSensitiveBooks(ngWords, books);

    expect(result.safeBooks.map(({ title }) => title)).toEqual([books[0].title, books[2].title]);

    expect(result.filteredBooks.map(({ title }) => title)).toEqual([books[1].title, books[3].title]);
  });

  test("NGワードが存在しない場合、すべてのタイトルがsafeに分類される", async () => {
    const ngWords = ["ネコ"];
    const books = [
      {
        ...createDummyBookDetail("0"),
        title: "セーフなタイトル",
      },
    ];

    const result = filterSensitiveBooks(ngWords, books);

    expect(result.safeBooks.map(({ title }) => title)).toEqual([books[0].title]);

    expect(result.filteredBooks.map(({ title }) => title)).toEqual([]);
  });

  test("すべてのタイトルがNGワードを含む場合、すべてfilteredに分類される", async () => {
    const ngWords = ["ダメ", "NG"];
    const books = [
      {
        ...createDummyBookDetail("0"),
        title: "ダメなやつ",
      },
      {
        ...createDummyBookDetail("1"),
        title: "NGなやつ",
      },
    ];

    const result = filterSensitiveBooks(ngWords, books);

    expect(result.safeBooks.map(({ title }) => title)).toHaveLength(0);

    expect(result.filteredBooks.map(({ title }) => title)).toEqual([books[0].title, books[1].title]);
  });

  test("NGワードが部分一致する場合、filteredに分類される", async () => {
    const ngWords = ["アイス"];
    const books = [
      {
        ...createDummyBookDetail("0"),
        title: "シンカンセンスゴイカタイアイスおいしい",
      },
      {
        ...createDummyBookDetail("1"),
        title: "ハーゲンダッツ",
      },
    ];

    const result = filterSensitiveBooks(ngWords, books);

    expect(result.filteredBooks.map(({ title }) => title)).toEqual([books[0].title]);

    expect(result.safeBooks.map(({ title }) => title)).toEqual([books[1].title]);
  });

  test("大文字小文字の違いを無視してNGワードを検出する", async () => {
    const ngWords = ["NgWord"];
    const books = [
      {
        ...createDummyBookDetail("0"),
        title: "This title contains ngword",
      },
      {
        ...createDummyBookDetail("1"),
        title: "Another safe title",
      },
    ];

    const result = filterSensitiveBooks(ngWords, books);

    expect(result.filteredBooks.map(({ title }) => title)).toEqual(["This title contains ngword"]);

    expect(result.safeBooks.map(({ title }) => title)).toEqual(["Another safe title"]);
  });
});
