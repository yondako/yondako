import IconHelp from "@/assets/icons/help.svg";
import Link from "@/components/Link";
import { auth } from "@/lib/auth.server";
import { Suspense } from "react";
import Layout from "../_components/Layout";
import SearchForm from "./_components/SearchForm";
import { SearchResult } from "./_components/SearchResult";

type Props = {
  searchParams: {
    q?: string;
  };
};

export default async function Search({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/search"));
  }

  const query = searchParams.q;

  // TODO: 検索前の表示

  return (
    <Layout current="キーワードで探す">
      <div className="flex flex-col items-end md:flex-row md:items-center">
        <SearchForm />
        <Link
          className="mt-4 flex shrink-0 items-center space-x-1 text-xs md:mt-0 md:ml-4"
          href="https://docs.yondako.com/data-source"
        >
          <IconHelp className="h-4 w-4" />
          <span>データはどこから取得してるの？</span>
        </Link>
      </div>

      {query ? (
        <Suspense fallback={<Loading />} key={query}>
          <SearchResult query={query} />
        </Suspense>
      ) : (
        <p className="mx-auto mt-12 w-fit font-noto-emoji">🐙</p>
      )}
    </Layout>
  );
}

function Loading() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
      <p className="animate-bounce cursor-grab font-noto-emoji">₍₍⁽⁽🐙₎₎⁾⁾</p>
      <p className="text-xs">検索しています</p>
    </div>
  );
}
