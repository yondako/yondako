import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import BookList from "@/components/BookList";
import MessageTako from "@/components/MessageTako";
import Pagination from "@/components/Pagination";
import { getAllNgWords } from "@/db/queries/ngWords";
import { getStatusesByBookIds } from "@/db/queries/status";
import { getAuth } from "@/lib/auth";
import { searchBooksFromNDL } from "@/lib/ndl";
import type { NDC } from "@/types/ndc";
import { DEFAULT_SEARCH_TYPE, type SearchType } from "@/types/search";
import SearchError from "../SearchError";

// NOTE: あまり大きいと getStatusesByBookIds 内で D1_ERROR: too many SQL variables が発生する
const SEARCH_COUNT = 24;

export type SearchResultProps = {
  query: string;
  searchType?: SearchType;
  currentPage: number;
  ndc?: NDC;
  sensitive?: boolean;
};

export async function SearchResult({
  query,
  searchType = DEFAULT_SEARCH_TYPE,
  currentPage,
  ndc,
  sensitive,
}: SearchResultProps) {
  const { env } = getCloudflareContext();

  const auth = getAuth(env.DB);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <p className="mt-12 text-center">ログインが必要です</p>;
  }

  const ngWords = sensitive ? [] : await getAllNgWords(env.DB);

  const searchParams: Parameters<typeof searchBooksFromNDL>[0]["params"] = { ndc };
  const trimmedQuery = query.trim();

  if (searchType === "title") {
    searchParams.title = trimmedQuery;
  } else if (searchType === "creator") {
    searchParams.creator = trimmedQuery;
  } else {
    searchParams.any = trimmedQuery;
  }

  const result = await searchBooksFromNDL({
    limit: SEARCH_COUNT,
    page: currentPage - 1,
    ignoreSensitive: !sensitive,
    ngWords,
    params: searchParams,
  });

  // 検索エラー
  if (!result) {
    return <SearchError />;
  }

  // 見つからない
  if (result.books.length === 0) {
    return (
      <MessageTako
        className="mt-16"
        title="見つかりませんでした"
        decoration={<span className="-right-8 absolute top-0 text-5xl">❓</span>}
      >
        <p className="mt-3">該当する書籍が見つかりませんでした。</p>
        <p>キーワードを変更して、再度お試しください。</p>
      </MessageTako>
    );
  }

  const items = await getStatusesByBookIds(env.DB, session.user.id, result.books);
  const totalPage = Math.ceil(result.meta.totalResults / SEARCH_COUNT);

  return (
    <>
      <h1 className="mt-10 font-bold">
        <span className="text-4xl">{result.meta.totalResults}</span>
        <span className="text-base">冊 みつかりました</span>
      </h1>
      <BookList items={items} />
      {totalPage > 1 && <Pagination className="mt-auto pt-10" currentPage={currentPage} totalPage={totalPage} />}
    </>
  );
}
