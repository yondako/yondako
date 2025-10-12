import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { is, safeParse } from "valibot";
import { readingStatusMetadata } from "@/constants/status";
import { getAuth } from "@/lib/auth";
import { getIsDesktop } from "@/lib/getIsDesktop";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import { type Order, orderSchema } from "@/types/order";
import { pageIndexSchema } from "@/types/page";
import { type ReadingStatus, libraryReadingStatusSchema } from "@/types/readingStatus";
import { LibraryBookList } from "./_components/LibraryBookList";
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

  if (!readingStatus || !is(libraryReadingStatusSchema, params.status)) {
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

  if (!is(libraryReadingStatusSchema, params.status)) {
    notFound();
  }

  const isDesktop = getIsDesktop(await headers());

  const searchParams = await props.searchParams;
  const pageParseResult = safeParse(pageIndexSchema, Number.parseInt(searchParams.page ?? "1"));

  const page = pageParseResult.success ? pageParseResult.output : 1;

  const orderParseResult = safeParse(orderSchema, searchParams.order);
  const orderType = orderParseResult.success ? orderParseResult.output : "desc";

  const contents = (
    <LibraryBookList status={params.status} page={page} order={orderType} titleKeyword={searchParams.q} />
  );

  return (
    <>
      <Tab current={params.status} />
      {isDesktop ? contents : <SwipeableTabView currentStatus={params.status}>{contents}</SwipeableTabView>}
    </>
  );
}
