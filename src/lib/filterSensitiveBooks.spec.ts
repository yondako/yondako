import { describe, expect, test } from "bun:test";
import { createDummyBookDetail } from "@/_mocks/book";
import { filterSensitiveBooks } from "./filterSensitiveBooks";

describe("filterNGWords", () => {
  test("NGワードを含むタイトルが間引かれる", async () => {
    const ngWords = ["ngword1", "ngword2"];
    const books = [
      {
        ...createDummyBookDetail("0"),
        title: "This is a safe title",
      },
      {
        ...createDummyBookDetail("1"),
        title: "This title contains ngword1",
      },
      {
        ...createDummyBookDetail("2"),
        title: "Another safe title",
      },
      {
        ...createDummyBookDetail("3"),
        title: "ngword2 is here",
      },
    ];

    const result = filterSensitiveBooks(ngWords, books);

    expect(result.filteredBooks.map(({ title }) => title)).toEqual([
      "This is a safe title",
      "Another safe title",
    ]);

    expect(result.filteredBooks.map(({ title }) => title)).toEqual([
      "This title contains ngword1",
      "ngword2 is here",
    ]);
  });

  test("NGワードが存在しない場合、すべてのタイトルがsafeに分類される", async () => {
    const ngWords = ["ngword1", "ngword2"];
    const books = [
      {
        ...createDummyBookDetail("0"),
        title: "Completely safe title",
      },
      {
        ...createDummyBookDetail("1"),
        title: "Another safe title",
      },
    ];

    const result = filterSensitiveBooks(ngWords, books);

    expect(result.filteredBooks.map(({ title }) => title)).toEqual([
      "Completely safe title",
      "Another safe title",
    ]);

    expect(result.filteredBooks.map(({ title }) => title)).toEqual([]);
  });

  test("すべてのタイトルがNGワードを含む場合、すべてfilteredに分類される", async () => {
    const ngWords = ["ngword1", "ngword2"];
    const books = [
      {
        ...createDummyBookDetail("0"),
        title: "ngword1 in title",
      },
      {
        ...createDummyBookDetail("1"),
        title: "ngword2 in title",
      },
    ];

    const result = filterSensitiveBooks(ngWords, books);

    expect(result.filteredBooks.map(({ title }) => title)).toEqual([]);

    expect(result.filteredBooks.map(({ title }) => title)).toEqual([
      "ngword1 in title",
      "ngword2 in title",
    ]);
  });
});
