import { expect, test } from "bun:test";
import { toIsbn10 } from "./toIsbn10";

test("ISBN-10ならそのまま返る", () => {
  const isbn = "4003101014";
  expect(toIsbn10(isbn)).toBe(isbn);
});

test("ケタ数が違う場合はnullが返る", () => {
  const isbn = "978-3-16-148410-00";
  expect(toIsbn10(isbn)).toBe(null);
});

test("ISBN-13からISBN-10に変換できる", () => {
  const isbn = "978-4-00-310101-3";
  expect(toIsbn10(isbn)).toBe("4003101014");
});

test("末尾がXになる", () => {
  const isbn = "978-3-16-148410-0";
  expect(toIsbn10(isbn)).toBe("316148410X");
});

test("末尾が0になる", () => {
  const isbn = "978-1-42-095130-1";
  expect(toIsbn10(isbn)).toBe("1420951300");
});

test("入力がnullならnullが返る", () => {
  expect(toIsbn10(null)).toBe(null);
});

test("入力がundefinedならnullが返る", () => {
  expect(toIsbn10(undefined)).toBe(null);
});
