import {
  getBooksWithoutNdlBibId,
  updateBooksMissingNdlBibId,
} from "@/db/queries/book";
import { searchBooksFromNDL } from "@/lib/ndl";
import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";
import pLimit from "p-limit";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const accessKey = req.headers.get("X-API-SECRET-KEY");

  if (accessKey !== process.env.API_SECRET_KEY) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  const { ctx } = getRequestContext();

  ctx.waitUntil(updateMissingNdlBibId());

  return new Response("OK", {
    status: 200,
  });
}

const limit = pLimit(5);

/**
 * NDL書誌IDのない書籍データを更新
 */
async function updateMissingNdlBibId() {
  const targetBooks = await getBooksWithoutNdlBibId();

  console.log(`Target books: ${targetBooks.length}`);

  const tasks = targetBooks.map(({ isbn }) =>
    limit(async () => {
      if (!isbn) {
        return;
      }

      const result = await searchBooksFromNDL({
        cnt: 1,
        isbn,
      });

      const resultBook = result?.books?.at(0);

      // NDL書誌IDが取得できなかった、またはISBNが一致しない場合はスキップ
      if (!resultBook || !resultBook.ndlBibId || resultBook.isbn !== isbn) {
        console.log(`Skipped book: ${resultBook?.title ?? isbn}`);
        return;
      }

      await updateBooksMissingNdlBibId(isbn, resultBook);

      console.log(`Updated book: ${resultBook.title}`);
    }),
  );

  await Promise.allSettled(tasks);
}
