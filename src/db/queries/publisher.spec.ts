import { beforeEach, describe, expect, mock, test } from "bun:test";
import { createTestDB } from "@/_mocks/db";
import { publishers } from "../schema/book";
import { createPublisher } from "./publisher";

let db = createTestDB();

mock.module("@/db", () => ({
  getDB: () => db,
}));

// getDB をモックしているため実際には使われない
const dummyD1 = {} as D1Database;

beforeEach(() => {
  db = createTestDB();
});

describe("createPublisher", () => {
  test("新規の出版社を登録してIDを返す", async () => {
    const id = await createPublisher(dummyD1, "テスト出版社");

    const rows = await db.select().from(publishers).all();

    expect(rows).toEqual([{ id, name: "テスト出版社" }]);
  });

  test("既存の出版社名の場合は登録せず既存のIDを返す", async () => {
    const firstId = await createPublisher(dummyD1, "テスト出版社");
    const secondId = await createPublisher(dummyD1, "テスト出版社");

    expect(secondId).toBe(firstId);

    const rows = await db.select().from(publishers).all();

    expect(rows).toHaveLength(1);
  });
});
