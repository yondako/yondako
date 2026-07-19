import { beforeEach, describe, expect, mock, test } from "bun:test";
import { createTestDB } from "@/_mocks/db";
import { ngWords } from "../schema/book";
import { getAllNgWords } from "./ngWords";

let db = createTestDB();

mock.module("next/cache", () => ({
  // キャッシュ層を素通しして、クエリ本体の挙動だけを検証する
  unstable_cache: (fn: () => unknown) => fn,
}));

mock.module("@/db", () => ({
  getDB: () => db,
}));

// getDB をモックしているため実際には使われない
const dummyD1 = {} as D1Database;

beforeEach(() => {
  db = createTestDB();
});

describe("getAllNgWords", () => {
  test("有効なNGワードのみ返す", async () => {
    await db.insert(ngWords).values([{ word: "有効なワード" }, { word: "無効なワード", isActive: false }]);

    const result = await getAllNgWords(dummyD1);

    expect(result).toEqual(["有効なワード"]);
  });

  test("NGワードが存在しない場合は空配列を返す", async () => {
    const result = await getAllNgWords(dummyD1);

    expect(result).toEqual([]);
  });
});
