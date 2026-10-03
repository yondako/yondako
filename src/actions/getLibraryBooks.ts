"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { minValue, number, object, optional, pipe, safeInteger, safeParse, string } from "valibot";
import { type SearchBooksFromLibraryOptions, searchBooksFromLibrary } from "@/db/queries/status";
import { getAuth } from "@/lib/auth";
import type { BookType } from "@/types/book";
import { orderSchema } from "@/types/order";
import { libraryStatusSchema } from "@/types/readingStatus";

const searchOptionsSchema = object({
  status: libraryStatusSchema,
  order: orderSchema,
  page: pipe(number(), safeInteger(), minValue(1)),
  pageSize: pipe(number(), safeInteger(), minValue(1)),
  titleKeyword: optional(string()),
});

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
    // 未許可のプロパティをDBへ渡さず、所有者はセッションからのみ取得する。
    const parsedOptions = safeParse(searchOptionsSchema, options);
    if (!parsedOptions.success) {
      return { error: "検索条件が不正です" };
    }

    const result = await searchBooksFromLibrary(env.DB, {
      ...parsedOptions.output,
      userId: session.user.id,
    });

    return result;
  } catch (error) {
    console.error("Failed to fetch library books:", error);

    return {
      error: "書籍の取得に失敗しました",
    };
  }
}
