import { site } from "../src/constants/site";

const baseUrl = site.url;

if (!process.env.API_SECRET_KEY) {
  throw new Error("API_SECRET_KEY environment variable is not set");
}

const headers: HeadersInit = {
  "X-API-SECRET-KEY": process.env.API_SECRET_KEY,
};

// 更新確認が必要な書籍IDを取得
const res = await fetch(new URL("/api/books/updates-needed", baseUrl), {
  headers,
});

const bookIds = (await res.json()) as string[];

console.log(`更新対象の書籍: ${bookIds.length}件`);

// 20件ずつループ
const STEP = 20;

for (let i = 0; i < bookIds.length; i += STEP) {
  const ids = bookIds.slice(i, i + STEP);
  console.log(
    `更新をリクエスト: ${i / 10 + 1}/${Math.ceil(bookIds.length / 10)}`,
  );

  const updateRes = await fetch(new URL("/api/books/update", baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ ids }),
  });

  if (!updateRes.ok) {
    throw new Error(`HTTP error! status: ${updateRes.status}`);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
}
