import { afterEach, beforeAll, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";
import * as statusQueries from "@/db/queries/status";

const db = {} as D1Database;
const requestHeaders = new Headers();
const getSession = mock(async (): Promise<{ user: { id: string } } | null> => ({ user: { id: "current-user" } }));

mock.module("@opennextjs/cloudflare", () => ({ getCloudflareContext: () => ({ env: { DB: db } }) }));
mock.module("next/headers", () => ({ headers: async () => requestHeaders }));
mock.module("@/lib/auth", () => ({ getAuth: () => ({ api: { getSession } }) }));

let getLibraryBooks: typeof import("./getLibraryBooks").getLibraryBooks;

beforeAll(async () => {
  ({ getLibraryBooks } = await import("./getLibraryBooks"));
});

describe("getLibraryBooks", () => {
  const options = { status: "all", order: "desc", page: 1, pageSize: 10, titleKeyword: "ねこ" } as const;
  let search: ReturnType<typeof spyOn<typeof statusQueries, "searchBooksFromLibrary">>;

  beforeEach(() => {
    getSession.mockClear();
    getSession.mockResolvedValue({ user: { id: "current-user" } });
    search = spyOn(statusQueries, "searchBooksFromLibrary").mockResolvedValue({ books: [], total: 0 });
  });

  afterEach(() => {
    search.mockRestore();
  });

  test("検索条件と認証済みユーザーIDで検索する", async () => {
    expect(await getLibraryBooks(options)).toEqual({ books: [], total: 0 });
    expect(getSession).toHaveBeenCalledWith({ headers: requestHeaders });
    expect(search).toHaveBeenCalledWith(db, { ...options, userId: "current-user" });
  });

  test("入力に他ユーザーのIDや追加項目があっても許可した条件だけを渡す", async () => {
    await getLibraryBooks({ ...options, userId: "other-user", extra: "untrusted" } as typeof options);

    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith(db, { ...options, userId: "current-user" });
  });

  test("未認証ならDBを検索しない", async () => {
    getSession.mockResolvedValue(null);

    expect(await getLibraryBooks(options)).toEqual({ error: "この操作にはログインが必要です" });
    expect(search).not.toHaveBeenCalled();
  });

  test.each([
    null,
    {},
    { ...options, status: "none" },
    { ...options, order: "invalid" },
    { ...options, page: 0 },
    { ...options, page: 1.5 },
    { ...options, pageSize: -1 },
    { ...options, pageSize: Infinity },
    { ...options, titleKeyword: 123 },
  ])("不正な入力 %j ではDBを検索しない", async (input) => {
    expect(await getLibraryBooks(input as typeof options)).toEqual({ error: "検索条件が不正です" });
    expect(search).not.toHaveBeenCalled();
  });
});
