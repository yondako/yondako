import { beforeEach, describe, expect, mock, test } from "bun:test";
import { createTestDB } from "@/_mocks/db";
import type { ReadingStatus } from "@/types/readingStatus";
import { bookAuthors, bookPublishers, books, readingStatuses } from "../schema/book";
import { user } from "../schema/user";
import { createAuthor } from "./author";
import { createPublisher } from "./publisher";
import { getStatusesByBookIds, searchBooksFromLibrary, upsertReadingStatus } from "./status";

let db = createTestDB();

mock.module("@/db", () => ({
  getDB: () => db,
}));

// getDB をモックしているため実際には使われない
const dummyD1 = {} as D1Database;

beforeEach(() => {
  db = createTestDB();
});

async function seedUser(id: string): Promise<void> {
  await db.insert(user).values({ id, email: `${id}@example.com` });
}

async function seedBook(values: Partial<typeof books.$inferInsert> = {}) {
  return db
    .insert(books)
    .values({ title: "タイトル", link: "https://example.com", ...values })
    .returning()
    .get();
}

async function seedReadingStatus(
  userId: string,
  bookId: string,
  status: ReadingStatus,
  updatedAt?: string,
): Promise<void> {
  await db.insert(readingStatuses).values({ userId, bookId, status, updatedAt });
}

describe("upsertReadingStatus", () => {
  test("新規にステータスを作成できる", async () => {
    await seedUser("user1");
    const book = await seedBook();

    const result = await upsertReadingStatus(dummyD1, "user1", book.id, "reading");

    expect(result).toBe("reading");

    const rows = await db.select().from(readingStatuses).all();

    expect(rows).toHaveLength(1);
    expect(rows[0]?.status).toBe("reading");
  });

  test("既存のステータスは行を増やさず更新される", async () => {
    await seedUser("user1");
    const book = await seedBook();

    await upsertReadingStatus(dummyD1, "user1", book.id, "want_read");
    const result = await upsertReadingStatus(dummyD1, "user1", book.id, "read");

    expect(result).toBe("read");

    const rows = await db.select().from(readingStatuses).all();

    expect(rows).toHaveLength(1);
    expect(rows[0]?.status).toBe("read");
  });
});

describe("searchBooksFromLibrary", () => {
  const baseOptions = {
    userId: "user1",
    status: "reading",
    order: "desc",
    page: 1,
    pageSize: 10,
  } as const;

  test("ユーザーとステータスで絞り込まれる", async () => {
    await seedUser("user1");
    await seedUser("user2");

    const target = await seedBook({ title: "読んでる本" });
    const otherStatus = await seedBook({ title: "読みたい本" });
    const otherUser = await seedBook({ title: "他人の本" });

    await seedReadingStatus("user1", target.id, "reading");
    await seedReadingStatus("user1", otherStatus.id, "want_read");
    await seedReadingStatus("user2", otherUser.id, "reading");

    const result = await searchBooksFromLibrary(dummyD1, baseOptions);

    expect(result.total).toBe(1);
    expect(result.books.map(({ detail }) => detail.title)).toEqual(["読んでる本"]);
    expect(result.books[0]?.readingStatus).toBe("reading");
  });

  test("更新日時順に並び、ページネーションされる", async () => {
    await seedUser("user1");

    const book1 = await seedBook({ title: "本1" });
    const book2 = await seedBook({ title: "本2" });
    const book3 = await seedBook({ title: "本3" });

    // CURRENT_TIMESTAMP は秒単位で同値になりがちなので明示的に指定する
    await seedReadingStatus("user1", book1.id, "reading", "2024-01-01 00:00:00");
    await seedReadingStatus("user1", book2.id, "reading", "2024-01-02 00:00:00");
    await seedReadingStatus("user1", book3.id, "reading", "2024-01-03 00:00:00");

    const page1 = await searchBooksFromLibrary(dummyD1, { ...baseOptions, pageSize: 2 });

    expect(page1.total).toBe(3);
    expect(page1.books.map(({ detail }) => detail.title)).toEqual(["本3", "本2"]);

    const page2 = await searchBooksFromLibrary(dummyD1, { ...baseOptions, pageSize: 2, page: 2 });

    expect(page2.total).toBe(3);
    expect(page2.books.map(({ detail }) => detail.title)).toEqual(["本1"]);

    const asc = await searchBooksFromLibrary(dummyD1, { ...baseOptions, pageSize: 2, order: "asc" });

    expect(asc.books.map(({ detail }) => detail.title)).toEqual(["本1", "本2"]);
  });

  test("タイトルのキーワードで絞り込める", async () => {
    await seedUser("user1");

    const cat = await seedBook({ title: "ねこの本" });
    const dog = await seedBook({ title: "いぬの本" });

    await seedReadingStatus("user1", cat.id, "reading");
    await seedReadingStatus("user1", dog.id, "reading");

    const result = await searchBooksFromLibrary(dummyD1, { ...baseOptions, titleKeyword: "ねこ" });

    expect(result.total).toBe(1);
    expect(result.books.map(({ detail }) => detail.title)).toEqual(["ねこの本"]);
  });

  test("キーワードの % と _ はワイルドカードではなくリテラルとして扱われる", async () => {
    await seedUser("user1");

    const literal = await seedBook({ title: "進捗100%の本" });
    const similar = await seedBook({ title: "進捗100点の本" });

    await seedReadingStatus("user1", literal.id, "reading");
    await seedReadingStatus("user1", similar.id, "reading");

    // エスケープされていない場合は % がワイルドカードになり両方ヒットしてしまう
    const result = await searchBooksFromLibrary(dummyD1, { ...baseOptions, titleKeyword: "100%" });

    expect(result.total).toBe(1);
    expect(result.books.map(({ detail }) => detail.title)).toEqual(["進捗100%の本"]);
  });

  test("著者・出版社が配列に整形される", async () => {
    await seedUser("user1");

    const book = await seedBook({ title: "共著の本" });
    await seedReadingStatus("user1", book.id, "reading");

    const authorAId = await createAuthor(dummyD1, "著者A");
    const authorBId = await createAuthor(dummyD1, "著者B");
    const publisherId = await createPublisher(dummyD1, "出版社A");

    await db.insert(bookAuthors).values([
      { bookId: book.id, authorId: authorAId },
      { bookId: book.id, authorId: authorBId },
    ]);
    await db.insert(bookPublishers).values({ bookId: book.id, publisherId });

    const result = await searchBooksFromLibrary(dummyD1, baseOptions);

    // GROUP_CONCAT (DISTINCT) の並び順は保証されないためソートして比較
    expect(result.books[0]?.detail.authors?.sort()).toEqual(["著者A", "著者B"]);
    expect(result.books[0]?.detail.publishers).toEqual(["出版社A"]);
  });

  test("該当がない場合は空の結果を返す", async () => {
    await seedUser("user1");

    const result = await searchBooksFromLibrary(dummyD1, baseOptions);

    expect(result).toEqual({ books: [], total: 0 });
  });
});

describe("getStatusesByBookIds", () => {
  test("NDL書誌IDまたはISBNで該当するステータスを返し、未登録はnoneになる", async () => {
    await seedUser("user1");

    const byNdlBibId = await seedBook({ title: "NDLの本", ndlBibId: "100" });
    // DB側はハイフンありのISBN (NDL提供のデータを想定)
    const byIsbn = await seedBook({ title: "JPROの本", isbn: "978-4-04-000200-0" });

    await seedReadingStatus("user1", byNdlBibId.id, "reading");
    await seedReadingStatus("user1", byIsbn.id, "read");

    const identifiers = [
      { title: "NDLの本", link: "https://example.com", ndlBibId: "100", updateCheckCount: 0 },
      // 検索側はハイフンなしのISBN
      { title: "JPROの本", link: "https://example.com", isbn: "9784040002000", updateCheckCount: 0 },
      { title: "未登録の本", link: "https://example.com", ndlBibId: "999", updateCheckCount: 0 },
    ];

    const result = await getStatusesByBookIds(dummyD1, "user1", identifiers);

    expect(result.map(({ readingStatus }) => readingStatus)).toEqual(["reading", "read", "none"]);
    expect(result.map(({ detail }) => detail)).toEqual(identifiers);
  });

  test("他のユーザーのステータスは反映されない", async () => {
    await seedUser("user1");
    await seedUser("user2");

    const book = await seedBook({ title: "他人の本", ndlBibId: "100" });
    await seedReadingStatus("user2", book.id, "reading");

    const identifiers = [{ title: "他人の本", link: "https://example.com", ndlBibId: "100", updateCheckCount: 0 }];

    const result = await getStatusesByBookIds(dummyD1, "user1", identifiers);

    expect(result.map(({ readingStatus }) => readingStatus)).toEqual(["none"]);
  });
});
