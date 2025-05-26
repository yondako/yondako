import { beforeEach, describe, expect, jest, test, afterEach, vi } from "bun:test";
import { extractBookTitle, fetchSiteTitle } from "./sharedContent";

describe("extractBookTitle", () => {
  test("書籍のタイトルを抽出できる", () => {
    const text = "書籍のタイトル (出版社) https://example.com";
    const result = extractBookTitle(text);
    expect(result).toBe("書籍のタイトル");
  });

  test("URLが含まれていない場合はテキストをそのまま返す", () => {
    const text = "書籍のタイトル (出版社)";
    const result = extractBookTitle(text);
    expect(result).toBe("書籍のタイトル");
  });

  test("テキストが空の場合はnullを返す", () => {
    const text = "";
    const result = extractBookTitle(text);
    expect(result).toBeNull();
  });

  test("テキストがnullの場合はnullを返す", () => {
    const text = null;
    const result = extractBookTitle(text);
    expect(result).toBeNull();
  });

  test("書籍タイトルの形式が合わない場合はそのまま返す", () => {
    const text = "これは書籍のタイトルではありません";
    const result = extractBookTitle(text);
    expect(result).toBe("これは書籍のタイトルではありません");
  });

  test("URLが削除される", () => {
    const text =
      "書籍のタイトル (出版社) https://example.com そして http://example.org";
    const result = extractBookTitle(text);
    expect(result).toBe("書籍のタイトル");
  });
});

describe("fetchSiteTitle", () => {
  const originalFetch = global.fetch; // 元の fetch を保存

  beforeEach(() => {
    // jest.clearAllMocks(); // Replaced by vi.clearAllMocks() in afterEach
  });

  afterEach(() => {
    global.fetch = originalFetch; // 各テスト後に元の fetch に戻す
    vi.clearAllMocks(); // Using vi.clearAllMocks()
  });

  test("サイトのタイトルを正常に取得できる", async () => {
    const mockHtml =
      "<html><head><title>テストタイトル</title></head><body></body></html>";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => mockHtml, // textメソッドをasyncに
    } as Response);

    const title = await fetchSiteTitle("https://example.com");
    expect(title).toBe("テストタイトル");
  });

  test("タイトルが見つからない場合はnullを返す", async () => {
    const mockHtml = "<html><head></head><body></body></html>";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => mockHtml, // textメソッドをasyncに
    } as Response);

    const title = await fetchSiteTitle("https://example.com");
    expect(title).toBeNull();
  });

  test("フェッチ中にエラーが発生した場合はnullを返す", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("fetch error"));

    const title = await fetchSiteTitle("https://example.com");
    expect(title).toBeNull();
  });
});
