import { beforeEach, describe, expect, test } from "bun:test";
import { checkForNewNews } from "@/lib/news";

describe("checkForNewNews", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("新着のお知らせがある場合trueが返る", () => {
    localStorage.setItem("lastNewsCheckedAt", "1630000000000");
    const latestNewsPublishedAt = 1630000000001;
    expect(checkForNewNews(latestNewsPublishedAt)).toBe(true);
  });

  test("新着のお知らせがない場合falseが返る", () => {
    localStorage.setItem("lastNewsCheckedAt", "1630000000000");
    const latestNewsPublishedAt = 1630000000000;
    expect(checkForNewNews(latestNewsPublishedAt)).toBe(false);
  });

  test("localStorageに値がない場合trueが返る", () => {
    const latestNewsPublishedAt = 1630000000000;
    expect(checkForNewNews(latestNewsPublishedAt)).toBe(true);
  });

  test("windowがundefinedの場合falseが返る", () => {
    const originalWindow = global.window;

    // @ts-ignore
    // biome-ignore lint/performance/noDelete: <explanation>
    delete global.window;

    const latestNewsPublishedAt = 1630000000000;
    expect(checkForNewNews(latestNewsPublishedAt)).toBe(false);

    global.window = originalWindow;
  });
});
