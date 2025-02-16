import { readFileSync, readdirSync } from "node:fs";
import test, { expect } from "@playwright/test";
import type { StoryIndex } from "@storybook/types";

const isUpdate = !!process.env.UPDATE;

// スクリーンショットを取得しないストーリー
const skip = [
  // GIFがメインなので
  "common-loading--default",
];

const indexJson = readFileSync("storybook-static/index.json");
const json = JSON.parse(indexJson.toString()) as StoryIndex;

// __snapshots__/stories.spec.ts/ 以下のpngファイル名を配列に格納
const snapshotDir = "__snapshots__/stories.spec.ts/";
const pngFiles = isUpdate
  ? []
  : readdirSync(snapshotDir).filter((file) => file.endsWith(".png"));

for (const [id, { tags }] of Object.entries(json.entries)) {
  // Play関数を持つストーリーはスクリーンショットを取得しない
  if (tags?.includes("play-fn")) {
    continue;
  }

  // スキップ対象ならスキップ
  if (skip.includes(id)) {
    continue;
  }

  const snapshotFilename = `${id}.png`;

  // スナップショットが無い場合はスキップ
  if (!isUpdate && !pngFiles.includes(snapshotFilename)) {
    console.warn(`Snapshot not found: ${snapshotFilename}`);
    continue;
  }

  test(id, async ({ page }) => {
    const url = new URL("http://localhost:6006/iframe.html");
    url.searchParams.set("id", id);

    await page.goto(url.toString());

    // 画像の読み込みを待つ
    // https://github.com/microsoft/playwright/issues/6046#issuecomment-1803609118
    try {
      // NOTE: getByRole ではなく locator を使っているのは、SVG 画像を拾ってほしくないため
      for (const img of await page.locator("img").all()) {
        await expect(img).toHaveJSProperty("complete", true);
        await expect(img).not.toHaveJSProperty("naturalWidth", 0);
      }
    } catch (e) {
      // 失敗しても大丈夫なので無視
    }

    await expect(page).toHaveScreenshot(snapshotFilename, {
      fullPage: true,
    });
  });
}
