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

// 10件ずつループ
for (let i = 0; i < bookIds.length; i += 10) {
  const ids = bookIds.slice(i, i + 10);

  await fetch(new URL("/api/books/update", baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ ids }),
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
}
