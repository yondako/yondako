import { beforeEach, describe, expect, jest, test } from "bun:test";
import { extractBookTitle, fetchSiteTitle } from "./sharedContent";

describe("extractBookTitle", () => {
  test("テキストがnullの場合はnullを返す", () => {
    const result = extractBookTitle(null);
    expect(result).toBeNull();
  });

  test("書籍タイトルを正しく抽出する", () => {
    const text = "書籍タイトル (出版社)";
    const result = extractBookTitle(text);
    expect(result).toBe("書籍タイトル");
  });

  test("書籍タイトルを正しく抽出する（ハイフン）", () => {
    const text = "書籍タイトル - 出版社";
    const result = extractBookTitle(text);
    expect(result).toBe("書籍タイトル");
  });

  test("書籍タイトルを正しく抽出する（括弧）", () => {
    const text = "書籍タイトル（出版社）";
    const result = extractBookTitle(text);
    expect(result).toBe("書籍タイトル");
  });

  test("分割できなかった場合はそのまま返す", () => {
    const text = "単なるテキスト";
    const result = extractBookTitle(text);
    expect(result).toBe("単なるテキスト");
  });
});

describe("fetchSiteTitle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("サイトのタイトルを正常に取得できる", async () => {
    const mockHtml =
      "<html><head><title>テストタイトル</title></head><body></body></html>";
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      } as Response),
    );

    const title = await fetchSiteTitle("https://example.com");
    expect(title).toBe("テストタイトル");
  });

  test("タイトルが見つからない場合はnullを返す", async () => {
    const mockHtml = "<html><head></head><body></body></html>";
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      } as Response),
    );

    const title = await fetchSiteTitle("https://example.com");
    expect(title).toBeNull();
  });

  test("フェッチ中にエラーが発生した場合はnullを返す", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("fetch error")));

    const title = await fetchSiteTitle("https://example.com");
    expect(title).toBeNull();
  });
});
