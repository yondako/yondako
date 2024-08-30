import { expect, test } from "bun:test";
import { createThumbnailUrl } from "./createThumbnailUrl";

test("作成できる", () => {
  const got = createThumbnailUrl("978-4-906649-00-6");
  expect(got).toBe("https://ndlsearch.ndl.go.jp/thumbnail/9784906649006.jpg");
});
