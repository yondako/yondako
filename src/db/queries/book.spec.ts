import { beforeEach, describe, expect, mock, test } from "bun:test";
import { eq } from "drizzle-orm";
import { createDummyBookDetail } from "@/_mocks/book";
import { createTestDB } from "@/_mocks/db";
import { MAX_UPDATE_CHECK_COUNT } from "@/constants/db";
import { authors, bookAuthors, bookPublishers, books, publishers } from "../schema/book";
import {
  createBook,
  fetchBook,
  fetchSimpleBooksByIds,
  getBooksPossiblyNewReleases,
  incrementBooksUpdateCheckCount,
  updateBooksMissingNdlBibId,
} from "./book";

let db = createTestDB();

mock.module("@/db", () => ({
  getDB: () => db,
}));

// getDB をモックしているため実際には使われない
const dummyD1 = {} as D1Database;

beforeEach(() => {
  db = createTestDB();
});

describe("fetchBook", () => {
  test("識別子がどちらも無い場合はundefinedを返す", async () => {
    const result = await fetchBook(dummyD1, {});

    expect(result).toBeUndefined();
  });

  test("NDL書誌IDで取得でき、著者・出版社が整形される", async () => {
    const created = await createBook(dummyD1, createDummyBookDetail("100"));

    const result = await fetchBook(dummyD1, { ndlBibId: "100" });

    expect(result).toEqual({
      ...created,
      authors: ["ダミー著者"],
      publishers: ["ダミー出版社"],
    });
  });

  test("ISBNのハイフン有無を吸収して取得できる", async () => {
    // DB側はハイフンあり (NDL提供のデータを想定)
    const created = await createBook(dummyD1, createDummyBookDetail("200"));

    const result = await fetchBook(dummyD1, {
      ndlBibId: "存在しないID",
      isbn: "9784040002000",
    });

    expect(result?.id).toBe(created.id);
  });

  test("新刊 (NDL書誌IDなし) はISBNで取得できる", async () => {
    const created = await createBook(dummyD1, {
      ...createDummyBookDetail("300"),
      ndlBibId: undefined,
    });

    const result = await fetchBook(dummyD1, { isbn: "978-4-04-000300-0" });

    expect(result?.id).toBe(created.id);
  });

  test("該当する書籍がない場合はundefinedを返す", async () => {
    const result = await fetchBook(dummyD1, { ndlBibId: "999" });

    expect(result).toBeUndefined();
  });

  test("著者・出版社が紐付いていない場合はundefinedになる", async () => {
    await db.insert(books).values({
      title: "著者なしの本",
      link: "https://example.com",
      ndlBibId: "400",
    });

    const result = await fetchBook(dummyD1, { ndlBibId: "400" });

    expect(result?.authors).toBeUndefined();
    expect(result?.publishers).toBeUndefined();
  });
});

describe("fetchSimpleBooksByIds", () => {
  test("空配列を渡すと空配列を返す", async () => {
    const result = await fetchSimpleBooksByIds(dummyD1, []);

    expect(result).toEqual([]);
  });

  test("指定したIDの書籍のみ取得できる", async () => {
    const book1 = await createBook(dummyD1, createDummyBookDetail("100"));
    await createBook(dummyD1, createDummyBookDetail("200"));

    const result = await fetchSimpleBooksByIds(dummyD1, [book1.id]);

    expect(result.map(({ id }) => id)).toEqual([book1.id]);
  });
});

describe("createBook", () => {
  test("書籍・著者・出版社が登録される", async () => {
    const detail = {
      ...createDummyBookDetail("100"),
      authors: ["著者A", "著者B"],
      publishers: ["出版社A"],
    };

    const created = await createBook(dummyD1, detail);

    expect(created.id).toBeString();
    expect(created.title).toBe(detail.title);

    const authorRows = await db.select().from(authors).all();
    const bookAuthorRows = await db.select().from(bookAuthors).all();
    const publisherRows = await db.select().from(publishers).all();
    const bookPublisherRows = await db.select().from(bookPublishers).all();

    expect(authorRows.map(({ name }) => name)).toEqual(["著者A", "著者B"]);
    expect(bookAuthorRows).toHaveLength(2);
    expect(publisherRows.map(({ name }) => name)).toEqual(["出版社A"]);
    expect(bookPublisherRows).toHaveLength(1);
  });

  test("ISBNがある場合は書影取得用のQueueにジョブが送られる", async () => {
    const detail = createDummyBookDetail("100");
    const send = mock();

    const created = await createBook(dummyD1, detail, {
      thumbnailQueue: { send } as unknown as Queue<ThumbnailJobMessage>,
    });

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith({
      bookId: created.id,
      isbn: detail.isbn,
    });
  });

  test("ISBNがない場合はQueueにジョブが送られない", async () => {
    const detail = { ...createDummyBookDetail("100"), isbn: null };
    const send = mock();

    await createBook(dummyD1, detail, {
      thumbnailQueue: { send } as unknown as Queue<ThumbnailJobMessage>,
    });

    expect(send).not.toHaveBeenCalled();
  });
});

describe("incrementBooksUpdateCheckCount", () => {
  test("指定した書籍のみカウントが加算される", async () => {
    const book1 = await createBook(dummyD1, createDummyBookDetail("100"));
    const book2 = await createBook(dummyD1, createDummyBookDetail("200"));

    await incrementBooksUpdateCheckCount(dummyD1, [book1.id]);

    const rows = await db.select().from(books).all();
    const counts = new Map(rows.map((row) => [row.id, row.updateCheckCount]));

    expect(counts.get(book1.id)).toBe(1);
    expect(counts.get(book2.id)).toBe(0);
  });
});

describe("updateBooksMissingNdlBibId", () => {
  test("NDL書誌IDのない書籍のみ更新され、著者・出版社が登録される", async () => {
    const isbn = "978-4-04-000500-0";

    // 新刊として登録された書籍 (NDL書誌IDなし)
    const newRelease = await db
      .insert(books)
      .values({ title: "旧データ", link: "https://example.com", isbn })
      .returning()
      .get();

    // 同じISBNだがNDL書誌IDのある既存書籍
    const existing = await db
      .insert(books)
      .values({ title: "既存データ", link: "https://example.com", isbn, ndlBibId: "999" })
      .returning()
      .get();

    const newData = { ...createDummyBookDetail("500"), isbn };

    await updateBooksMissingNdlBibId(dummyD1, isbn, newData);

    const updated = await db.select().from(books).where(eq(books.id, newRelease.id)).get();

    expect(updated?.title).toBe(newData.title);
    expect(updated?.ndlBibId).toBe("500");

    // NDL書誌IDのある書籍は更新されない
    const untouched = await db.select().from(books).where(eq(books.id, existing.id)).get();

    expect(untouched?.title).toBe("既存データ");

    // 著者・出版社が更新対象の書籍に紐付く
    const bookAuthorRows = await db.select().from(bookAuthors).where(eq(bookAuthors.bookId, newRelease.id)).all();

    expect(bookAuthorRows).toHaveLength(1);
  });
});

describe("getBooksPossiblyNewReleases", () => {
  test("NDL書誌IDなし・ISBNあり・更新確認がしきい値未満の書籍のみ返す", async () => {
    const base = { link: "https://example.com", isbn: "978-4-04-000600-0" };

    const included1 = await db
      .insert(books)
      .values({ ...base, title: "新刊1", updateCheckCount: 0 })
      .returning()
      .get();

    // しきい値未満は含まれる (境界値)
    const included2 = await db
      .insert(books)
      .values({ ...base, title: "新刊2", updateCheckCount: MAX_UPDATE_CHECK_COUNT - 1 })
      .returning()
      .get();

    // しきい値ちょうどは除外される (境界値)
    await db.insert(books).values({ ...base, title: "確認済み", updateCheckCount: MAX_UPDATE_CHECK_COUNT });

    // NDL書誌IDのある書籍は除外される
    await db.insert(books).values({ ...base, title: "NDL登録済み", ndlBibId: "600" });

    // ISBNのない書籍は除外される
    await db.insert(books).values({ title: "ISBNなし", link: "https://example.com" });

    const result = await getBooksPossiblyNewReleases(dummyD1);

    expect(result.map(({ id }) => id).sort()).toEqual([included1.id, included2.id].sort());
  });
});
