import BookList from "@/components/BookList";
import MessageTako from "@/components/MessageTako";
import Pagination from "@/components/Pagination";
import { getStatusesByBookIds } from "@/db/queries/status";
import { getAuth } from "@/lib/auth";
import { searchBooksFromNDL } from "@/lib/ndl";
import type { NDC } from "@/types/ndc";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";

const SEARCH_COUNT = 48;

export type SearchResultProps = {
  query: string;
  currentPage: number;
  ndc?: NDC;
};

export async function SearchResult({
  query,
  currentPage,
  ndc,
}: SearchResultProps) {
  const { env } = getCloudflareContext();

  const auth = getAuth(env.DB);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <p className="mt-12 text-center">ログインが必要です</p>;
  }

  const result = await searchBooksFromNDL({
    count: SEARCH_COUNT,
    page: currentPage - 1,
    params: {
      any: query,
      ndc,
    },
  });

  // 検索エラー
  if (!result) {
    return (
      <MessageTako
        className="mt-16"
        title="検索できませんでした"
        decoration={
          <span className="-right-2 absolute top-0 text-5xl">🔧</span>
        }
      >
        <p className="mt-3">一時的に検索が利用できない状態です。</p>
        <p>時間をおいて、再度お試しください。</p>
      </MessageTako>
    );
  }

  // 見つからない
  if (result.books.length === 0) {
    return (
      <MessageTako
        className="mt-16"
        title="見つかりませんでした"
        decoration={
          <span className="-right-8 absolute top-0 text-5xl">❓️</span>
        }
      >
        <p className="mt-3">該当する書籍が見つかりませんでした。</p>
        <p>キーワードを変更して、再度お試しください。</p>
      </MessageTako>
    );
  }

  const items = await getStatusesByBookIds(
    env.DB,
    session.user.id,
    result.books,
  );

  const totalPage = Math.ceil(result.meta.totalResults / SEARCH_COUNT);

  return (
    <>
      <h1 className="mt-10 font-bold">
        <span className="text-4xl">{result.meta.totalResults}</span>
        <span className="text-base">冊 みつかりました</span>
      </h1>
      <BookList items={items} />
      {totalPage > 1 && (
        <Pagination
          className="mt-auto pt-10"
          currentPage={currentPage}
          totalPage={totalPage}
        />
      )}
    </>
  );
}
