import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
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
    const text = "書籍のタイトル (出版社) https://example.com そして http://example.org";
    const result = extractBookTitle(text);
    expect(result).toBe("書籍のタイトル");
  });
});

describe("fetchSiteTitle", () => {
  afterEach(() => {
    mock.restore();
  });

  test("サイトのタイトルを正常に取得できる", async () => {
    const mockHtml = "<html><head><title>テストタイトル</title></head><body></body></html>";
    spyOn(global, "fetch").mockResolvedValue(new Response(mockHtml));

    const title = await fetchSiteTitle("https://example.com");
    expect(title).toBe("テストタイトル");
  });

  test("タイトルが見つからない場合はnullを返す", async () => {
    const mockHtml = "<html><head></head><body></body></html>";
    spyOn(global, "fetch").mockResolvedValue(new Response(mockHtml));

    const title = await fetchSiteTitle("https://example.com");
    expect(title).toBeNull();
  });

  test("フェッチ中にエラーが発生した場合はnullを返す", async () => {
    spyOn(global, "fetch").mockRejectedValue(new Error("fetch error"));

    const title = await fetchSiteTitle("https://example.com");
    expect(title).toBeNull();
  });
});
