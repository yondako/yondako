"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { getStatusesByBookIds } from "@/db/queries/status";
import { getAuth } from "@/lib/auth";
import { findBookByIsbn } from "@/lib/ndl";
import type { BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";

export async function searchFromIsbn(isbn: string): Promise<BookType | undefined> {
  const { env } = getCloudflareContext();
  const auth = getAuth(env.DB);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return;
  }

  const book = await findBookByIsbn(isbn);

  if (!book) {
    return;
  }

  // ライブラリを検索
  const libraryBook = await getStatusesByBookIds(env.DB, session.user.id, [book]);

  // 自分の読書ステータス
  const readingStatus: ReadingStatus = libraryBook.at(0)?.readingStatus ?? "none";

  return {
    detail: book,
    readingStatus,
  };
}
