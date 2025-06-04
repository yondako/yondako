"use server";

import { type SearchBooksFromLibraryOptions, searchBooksFromLibrary } from "@/db/queries/status";
import { getAuth } from "@/lib/auth";
import type { BookType } from "@/types/book";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";

export type GetLibraryBooksSuccess = {
  books: BookType[];
  total: number;
};

export type GetLibraryBooksError = {
  error: string;
};

export type GetLibraryBooksResult = GetLibraryBooksSuccess | GetLibraryBooksError;

/**
 * ライブラリの書籍を取得するServer Action
 * @param options 検索オプション
 * @return 書籍のリストと総数、またはエラー
 */
export async function getLibraryBooks(
  options: Omit<SearchBooksFromLibraryOptions, "userId">,
): Promise<GetLibraryBooksResult> {
  const { env } = getCloudflareContext();
  const auth = getAuth(env.DB);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      error: "この操作にはログインが必要です",
    };
  }

  try {
    const result = await searchBooksFromLibrary(env.DB, {
      userId: session.user.id,
      ...options,
    });

    return result;
  } catch (error) {
    console.error("Failed to fetch library books:", error);

    return {
      error: "書籍の取得に失敗しました",
    };
  }
}
