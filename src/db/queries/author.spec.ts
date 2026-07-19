import { beforeEach, describe, expect, mock, test } from "bun:test";
import { createTestDB } from "@/_mocks/db";
import { authors } from "../schema/book";
import { createAuthor } from "./author";

let db = createTestDB();

mock.module("@/db", () => ({
  getDB: () => db,
}));

// getDB をモックしているため実際には使われない
const dummyD1 = {} as D1Database;

beforeEach(() => {
  db = createTestDB();
});

describe("createAuthor", () => {
  test("新規の著者を登録してIDを返す", async () => {
    const id = await createAuthor(dummyD1, "テスト著者");

    const rows = await db.select().from(authors).all();

    expect(rows).toEqual([{ id, name: "テスト著者" }]);
  });

  test("既存の著者名の場合は登録せず既存のIDを返す", async () => {
    const firstId = await createAuthor(dummyD1, "テスト著者");
    const secondId = await createAuthor(dummyD1, "テスト著者");

    expect(secondId).toBe(firstId);

    const rows = await db.select().from(authors).all();

    expect(rows).toHaveLength(1);
  });
});
