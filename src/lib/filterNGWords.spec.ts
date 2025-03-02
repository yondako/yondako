import { describe, expect, test } from "bun:test";
import { filterNGWords } from "./filterNGWords";

describe("filterNGWords", () => {
  test("NGワードを含むタイトルが間引かれる", async () => {
    const ngWords = ["ngword1", "ngword2"];
    const titles = [
      "This is a safe title",
      "This title contains ngword1",
      "Another safe title",
      "ngword2 is here",
    ];

    const result = await filterNGWords(ngWords, titles);

    expect(result.safeStrings).toEqual([
      "This is a safe title",
      "Another safe title",
    ]);

    expect(result.filteredStrings).toEqual([
      "This title contains ngword1",
      "ngword2 is here",
    ]);
  });

  test("NGワードが存在しない場合、すべてのタイトルがsafeに分類される", async () => {
    const ngWords = ["ngword1", "ngword2"];
    const titles = ["Completely safe title", "Another safe title"];

    const result = await filterNGWords(ngWords, titles);

    expect(result.safeStrings).toEqual(titles);
    expect(result.filteredStrings).toEqual([]);
  });

  test("すべてのタイトルがNGワードを含む場合、すべてfilteredに分類される", async () => {
    const ngWords = ["ngword1", "ngword2"];
    const titles = ["ngword1 in title", "ngword2 in title"];

    const result = await filterNGWords(ngWords, titles);

    expect(result.safeStrings).toEqual([]);
    expect(result.filteredStrings).toEqual(titles);
  });
});
