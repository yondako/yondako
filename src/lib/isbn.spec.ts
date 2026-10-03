import { describe, expect, test } from "bun:test";
import { isSameIsbn, toIsbn13 } from "./isbn";

describe("toIsbn13", () => {
  test.each([
    ["4-87571-862-4", "9784875718628"],
    ["4875719469", "9784875719465"],
    ["978-4-87571-946-5", "9784875719465"],
  ])("%s を %s に変換する", (input, expected) => {
    expect(toIsbn13(input)).toBe(expected);
  });

  test("ISBNとして解釈できない値はハイフンを削除して返す", () => {
    expect(toIsbn13("12-34")).toBe("1234");
    expect(toIsbn13(undefined)).toBeUndefined();
  });
});

describe("isSameIsbn", () => {
  test("ISBN-10とISBN-13の表記ゆれを同じ書籍として扱う", () => {
    expect(isSameIsbn("4-87571-946-9", "9784875719465")).toBe(true);
  });

  test("異なるISBNは別の書籍として扱う", () => {
    expect(isSameIsbn("4-87571-862-4", "9784875719465")).toBe(false);
  });

  test("ISBNが無い場合は一致しない", () => {
    expect(isSameIsbn(undefined, undefined)).toBe(false);
  });
});
