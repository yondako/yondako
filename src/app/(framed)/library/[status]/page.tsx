import { Loading } from "@/components/Loading";
import { readingStatusMetadata } from "@/constants/status";
import { getAuth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import { type Order, orderSchema } from "@/types/order";
import { pageIndexSchema } from "@/types/page";
import {
  type ReadingStatus,
  readingStatusSchemaWithoutNone,
} from "@/types/readingStatus";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { is, safeParse } from "valibot";
import { LibraryBookList } from "./_components/LibraryBookList/LibraryBookList";
import { SwipeableTabView } from "./_components/SwipeableTabView";
import Tab from "./_components/Tab";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    status: ReadingStatus;
  }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
    order?: Order;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const readingStatus = readingStatusMetadata.get(params.status);

  if (!readingStatus || !is(readingStatusSchemaWithoutNone, params.status)) {
    notFound();
  }

  return generateMetadataTitle({
    pageTitle: readingStatus.label,
    noindex: true,
  });
}

export default async function Library(props: Props) {
  const params = await props.params;

  const { env } = await getCloudflareContext({
    async: true,
  });

  const auth = getAuth(env.DB);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect(createSignInPath(`/library/${params.status}`));
  }

  if (!is(readingStatusSchemaWithoutNone, params.status)) {
    notFound();
  }

  const isDesktop = (await headers()).get("X-IS-DESKTOP") !== null;

  const searchParams = await props.searchParams;
  const pageParseResult = safeParse(
    pageIndexSchema,
    Number.parseInt(searchParams.page ?? "1"),
  );

  const page = pageParseResult.success ? pageParseResult.output : 1;

  const orderParseResult = safeParse(orderSchema, searchParams.order);
  const orderType = orderParseResult.success ? orderParseResult.output : "desc";

  const contents = (
    <Suspense
      fallback={
        <Loading
          className="mt-12 justify-start lg:mt-0 lg:justify-center"
          title="読み込んでいます"
        />
      }
    >
      <LibraryBookList
        status={params.status}
        page={page}
        order={orderType}
        titleKeyword={searchParams.q}
      />
    </Suspense>
  );

  return (
    <>
      <Tab current={params.status} />
      {isDesktop ? (
        contents
      ) : (
        <SwipeableTabView currentStatus={params.status}>
          {contents}
        </SwipeableTabView>
      )}
    </>
  );
}
