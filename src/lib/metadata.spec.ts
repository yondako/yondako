import { expect, test } from "bun:test";
import { site } from "@/constants/site";
import { generateMetadataTitle } from "./metadata";

test("タイトルが設定できる", () => {
  const result = generateMetadataTitle({
    pageTitle: "タイトル",
  });

  expect(result.title).toBe(`タイトル | ${site.name}`);
});

test("OpenGraphとTwitter用の設定がある", () => {
  const result = generateMetadataTitle({
    pageTitle: "タイトル",
  });

  expect(result.openGraph?.title).toBe(`タイトル | ${site.name}`);
});

test("タイトルを省略するとデフォルトのタイトルになる", () => {
  const result = generateMetadataTitle();

  expect(result.title).toBe(`${site.name} | ${site.description.short}`);
});

test("noindexがtrueの場合、robots.indexがfalseになる", () => {
  const result = generateMetadataTitle({
    pageTitle: "タイトル",
    noindex: true,
  });

  if (typeof result.robots === "string") {
    throw new Error("robots が string になっている");
  }

  expect(result.robots?.index).toBe(false);
});

test("noindexがfalseの場合、robots.indexがtrueになる", () => {
  const result = generateMetadataTitle({
    pageTitle: "タイトル",
    noindex: false,
  });

  if (typeof result.robots === "string") {
    throw new Error("robots が string になっている");
  }

  expect(result.robots?.index).toBe(true);
});

test("noindexが指定されていない場合、robots.indexがtrueになる", () => {
  const result = generateMetadataTitle({
    pageTitle: "タイトル",
  });

  if (typeof result.robots === "string") {
    throw new Error("robots が string になっている");
  }

  expect(result.robots?.index).toBe(true);
});
