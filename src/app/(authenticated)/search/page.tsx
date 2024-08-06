import IconHelp from "@/assets/icons/help.svg";
import ExternalLink from "@/components/ExternalLink";
import { Loading } from "@/components/Loading";
import SayTako from "@/components/SayTako";
import { auth } from "@/lib/auth.server";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/url";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SearchForm from "./_components/SearchForm";
import { SearchResult } from "./_components/SearchResult";
import { pageIndexSchema } from "@/types/page";
import { safeParse } from "valibot";
import type { Metadata } from "next";

export const runtime = "edge";

type Props = {
  searchParams: {
    q?: string;
    page?: string;
  };
};

export function generateMetadata({ searchParams }: Props): Metadata {
  return generateMetadataTitle(`「${searchParams.q}」の検索結果`);
}

export default async function Search({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/search"));
  }

  // ページ数
  const pageParseResult = safeParse(
    pageIndexSchema,
    Number.parseInt(searchParams.page ?? "1"),
  );
  const page = pageParseResult.success ? pageParseResult.output : 1;

  // キーワード
  const query = searchParams.q;

  return (
    <>
      <div className="flex flex-col items-end md:flex-row md:items-center">
        <SearchForm />
        <ExternalLink
          className="mt-4 flex shrink-0 items-center space-x-1 text-xs md:mt-0 md:ml-4"
          href="https://docs.yondako.com/data-source"
        >
          <IconHelp className="h-4 w-4" />
          <span>データはどこから取得してるの？</span>
        </ExternalLink>
      </div>

      {query ? (
        <Suspense
          fallback={
            <Loading className="mt-12 md:mt-0" title="検索しています" />
          }
          key={`${query}_${page}`}
        >
          <SearchResult query={query} currentPage={page} />
        </Suspense>
      ) : (
        <SayTako message="ｹﾝｻｸｼﾃﾈ" />
      )}
    </>
  );
}
