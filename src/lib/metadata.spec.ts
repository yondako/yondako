import { site } from "@/constants/site";
import { expect, test } from "bun:test";
import { generateMetadataTitle } from "./metadata";

test("タイトルが設定できる", () => {
  expect(generateMetadataTitle("タイトル").title).toBe(
    `タイトル | ${site.name}`,
  );
});

test("OpenGraphとTwitter用の設定がある", () => {
  expect(generateMetadataTitle("タイトル").openGraph?.title).toBe(
    `タイトル | ${site.name}`,
  );
});

test("タイトルを省略するとデフォルトのタイトルになる", () => {
  expect(generateMetadataTitle().title).toBe(
    `${site.name} | ${site.description.short}`,
  );
});
