import { readFileSync } from "node:fs";
import test, { expect } from "@playwright/test";
import type { StoryIndex } from "@storybook/types";

// スクリーンショットを取得しないストーリー
const skip = [
  // GIFがメインなので
  "common-loading--default",
];

const indexJson = readFileSync("storybook-static/index.json");

const json = JSON.parse(indexJson.toString()) as StoryIndex;

for (const [id, { tags }] of Object.entries(json.entries)) {
  // Play関数を持つストーリーはスクリーンショットを取得しない
  if (tags?.includes("play-fn")) {
    continue;
  }

  if (skip.includes(id)) {
    continue;
  }

  test(id, async ({ page }) => {
    const url = new URL("http://localhost:6006/iframe.html");
    url.searchParams.set("id", id);

    await page.goto(url.toString());

    await page.waitForTimeout(250);

    await expect(page).toHaveScreenshot(`${id}.png`);
  });
}
