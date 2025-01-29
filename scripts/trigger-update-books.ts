import { site } from "../src/constants/site";
import { MAX_UPDATE_BOOKS_PER_REQUEST } from "../src/constants/update-books";

const baseUrl = site.url;
const apiSecretKey = process.env.API_SECRET_KEY;

if (!apiSecretKey) {
  throw new Error("API_SECRET_KEY environment variable is not set");
}

const headers: HeadersInit = {
  "X-API-SECRET-KEY": apiSecretKey,
};

// 更新確認が必要な書籍IDを取得
const res = await fetch(new URL("/api/books/updates-needed", baseUrl), {
  headers,
});

const bookIds = (await res.json()) as string[];

console.log(`更新対象の書籍: ${bookIds.length}件`);

for (let i = 0; i < bookIds.length; i += MAX_UPDATE_BOOKS_PER_REQUEST) {
  const ids = bookIds.slice(i, i + MAX_UPDATE_BOOKS_PER_REQUEST);

  console.log(
    `更新をリクエスト: ${i + 1}/${Math.ceil(bookIds.length / MAX_UPDATE_BOOKS_PER_REQUEST)}`,
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
