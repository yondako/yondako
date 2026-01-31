/**
 * 既存書籍の書影をRakuten Books APIから取得してD1に保存するスクリプト
 *
 * 使用方法:
 *   # ローカルD1に対して実行
 *   RAKUTEN_APP_ID=xxx bun run scripts/backfill-thumbnails.ts
 *
 *   # リモートD1（Dev環境）に対して実行
 *   RAKUTEN_APP_ID=xxx bun run scripts/backfill-thumbnails.ts --remote
 *
 *   # リモートD1（Prod環境）に対して実行
 *   RAKUTEN_APP_ID=xxx bun run scripts/backfill-thumbnails.ts --remote --env production
 */

import { $ } from "bun";

const RAKUTEN_API_ENDPOINT = "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404";
const RATE_LIMIT_MS = 1000;

type Book = {
  id: string;
  isbn: string;
};

type RakutenBooksResponse = {
  Items?: Array<{ largeImageUrl?: string }>;
};

async function fetchThumbnailUrl(isbn: string, applicationId: string): Promise<string | null> {
  const url = new URL(RAKUTEN_API_ENDPOINT);
  url.searchParams.set("applicationId", applicationId);
  url.searchParams.set("isbn", isbn.replace(/-/g, ""));
  url.searchParams.set("formatVersion", "2");

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Rakuten API error: ${res.status} ${res.statusText}`);
  }

  const data: RakutenBooksResponse = await res.json();
  // 書籍が見つからない場合はItems: []が返るのでnull
  return data.Items?.[0]?.largeImageUrl ?? null;
}

async function getBooks(isRemote: boolean, env?: string): Promise<Book[]> {
  const dbName = env === "production" ? "yondako" : "yondako_dev";
  const query = "SELECT id, isbn FROM books WHERE isbn IS NOT NULL AND thumbnail_url IS NULL";

  const args = ["d1", "execute", dbName, "--json", "--command", query];
  if (isRemote) {
    args.push("--remote");
  } else {
    args.push("--local");
  }
  if (env) {
    args.push("--env", env);
  }

  const result = await $`bunx wrangler ${args}`.text();
  const parsed = JSON.parse(result);

  // wrangler d1 executeの出力形式に対応
  const rows = parsed?.[0]?.results ?? [];
  return rows as Book[];
}

async function updateThumbnailUrl(
  bookId: string,
  thumbnailUrl: string,
  isRemote: boolean,
  env?: string,
): Promise<void> {
  const dbName = env === "production" ? "yondako" : "yondako_dev";
  const query = `UPDATE books SET thumbnail_url = '${thumbnailUrl.replace(/'/g, "''")}' WHERE id = '${bookId}'`;

  const args = ["d1", "execute", dbName, "--command", query];
  if (isRemote) {
    args.push("--remote");
  } else {
    args.push("--local");
  }
  if (env) {
    args.push("--env", env);
  }

  await $`bunx wrangler ${args}`.quiet();
}

async function main() {
  const appId = process.env.RAKUTEN_APP_ID;
  if (!appId) {
    console.error("Error: RAKUTEN_APP_ID environment variable is required");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const isRemote = args.includes("--remote");
  const envIndex = args.indexOf("--env");
  const env = envIndex !== -1 ? args[envIndex + 1] : undefined;

  console.log(`Target: ${isRemote ? "remote" : "local"} ${env ? `(${env})` : ""}`);
  console.log("Fetching books without thumbnails...\n");

  const books = await getBooks(isRemote, env);
  console.log(`Found ${books.length} books to process\n`);

  if (books.length === 0) {
    console.log("No books to process. Done!");
    return;
  }

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const progress = `[${i + 1}/${books.length}]`;

    console.log(`${progress} Processing ISBN: ${book.isbn}`);

    try {
      const thumbnailUrl = await fetchThumbnailUrl(book.isbn, appId);

      if (thumbnailUrl) {
        await updateThumbnailUrl(book.id, thumbnailUrl, isRemote, env);
        console.log(`  -> Updated: ${thumbnailUrl}`);
        successCount++;
      } else {
        console.log(`  -> Skipped: No thumbnail found`);
        skipCount++;
      }
    } catch (error) {
      console.error(`  -> Error: ${error}`);
      errorCount++;
    }

    // レート制限対応（最後以外は1秒待機）
    if (i < books.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Success: ${successCount}`);
  console.log(`Skipped: ${skipCount}`);
  console.log(`Errors:  ${errorCount}`);
  console.log(`Total:   ${books.length}`);
}

main().catch(console.error);
