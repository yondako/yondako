import IconHelp from "@/assets/icons/help.svg";
import ExternalLink from "@/components/ExternalLink";
import { Loading } from "@/components/Loading";
import SayTako from "@/components/SayTako";
import { site } from "@/constants/site";
import { getAuth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import { ndcSchema } from "@/types/ndc";
import { pageIndexSchema } from "@/types/page";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { safeParse } from "valibot";
import SearchForm from "./_components/SearchForm";
import { SearchResult } from "./_components/SearchResult";

type Props = {
  searchParams: Promise<{
    ndc?: string;
    q?: string;
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

const dataSourceUrl = new URL("/docs/data-source", site.infoUrl).toString();

export default async function Search(props: Props) {
  const { env } = await getCloudflareContext({
    async: true,
  });

  const auth = getAuth(env.DB);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect(createSignInPath("/search"));
  }

  const searchParams = await props.searchParams;

  // ページ数
  const pageParseResult = safeParse(
    pageIndexSchema,
    Number.parseInt(searchParams.page ?? "1"),
  );
  const page = pageParseResult.success ? pageParseResult.output : 1;

  // NDC
  const ndcParseResult = safeParse(ndcSchema, searchParams.ndc);
  const ndc = ndcParseResult.success ? ndcParseResult.output : undefined;

  // 検索クエリ
  const query = searchParams.q;

  return (
    <>
      <div className="flex flex-col items-end lg:flex-row lg:items-center">
        <SearchForm ndc={ndc} query={query} />
        <ExternalLink
          className="mt-4 flex shrink-0 items-center space-x-1 text-xs lg:mt-0 lg:ml-4"
          href={dataSourceUrl}
        >
          <IconHelp className="h-4 w-4" />
          <span>使用しているデータについて</span>
        </ExternalLink>
      </div>

      {query ? (
        <Suspense
          fallback={
            <Loading
              className="mt-12 justify-start lg:mt-0 lg:justify-center"
              title="がんばって検索しています"
            />
          }
          key={`${query}_${page}`}
        >
          <SearchResult query={query} ndc={ndc} currentPage={page} />
        </Suspense>
      ) : (
        <SayTako message="ｹﾝｻｸｼﾃﾈ" />
      )}
    </>
  );
}
