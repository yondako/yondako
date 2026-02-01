import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { parse, safeParse } from "valibot";
import IconHelp from "@/assets/icons/help.svg";
import ExternalLink from "@/components/ExternalLink";
import { Loading } from "@/components/Loading";
import SayTako from "@/components/SayTako";
import { PATH_SEARCH } from "@/constants/path";
import { links } from "@/constants/site";
import { getAuth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import { ndcSchema } from "@/types/ndc";
import { pageIndexSchema } from "@/types/page";
import { searchTypeSchema } from "@/types/search";
import SearchForm from "./_components/SearchForm";
import { SearchResult } from "./_components/SearchResult";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    ndc?: string;
    sensitive?: string;
    page?: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const query = searchParams.q;

  return generateMetadataTitle({
    pageTitle: query ? `「${query}」の検索結果` : "キーワードで探す",
    noindex: true,
  });
}

export default async function Search(props: Props) {
  const { env } = await getCloudflareContext({
    async: true,
  });

  const auth = getAuth(env.DB);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect(createSignInPath(PATH_SEARCH));
  }

  const searchParams = await props.searchParams;

  // ページ数
  const pageParseResult = safeParse(pageIndexSchema, Number.parseInt(searchParams.page ?? "1", 10));
  const page = pageParseResult.success ? pageParseResult.output : 1;

  // NDC
  const ndcParseResult = safeParse(ndcSchema, searchParams.ndc);
  const ndc = ndcParseResult.success ? ndcParseResult.output : undefined;

  // センシティブな書籍を含めるか
  const sensitive = !!searchParams.sensitive;

  // 検索クエリ
  const query = searchParams.q;

  // 検索タイプ
  const searchType = parse(searchTypeSchema, searchParams.type);

  return (
    <>
      <div className="flex flex-col items-end lg:flex-row lg:items-center">
        <SearchForm query={query} searchType={searchType} ndc={ndc} sensitive={sensitive} />
        <ExternalLink
          className="mt-4 flex shrink-0 items-center space-x-1 text-xs lg:mt-0 lg:ml-4"
          href={links.dataSource.href}
        >
          <IconHelp className="h-4 w-4" />
          <span>{links.dataSource.title}</span>
        </ExternalLink>
      </div>

      {query ? (
        <Suspense
          fallback={
            <Loading className="mt-12 justify-start lg:mt-0 lg:justify-center" title="がんばって検索しています" />
          }
          key={Object.values(searchParams).join("_")}
        >
          <SearchResult query={query} searchType={searchType} ndc={ndc} sensitive={sensitive} currentPage={page} />
        </Suspense>
      ) : (
        <SayTako message="ｹﾝｻｸｼﾃﾈ" />
      )}
    </>
  );
}
