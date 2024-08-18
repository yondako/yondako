import { Loading } from "@/components/Loading";
import { auth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import { type Order, orderSchema } from "@/types/order";
import { pageIndexSchema } from "@/types/page";
import {
  type ReadingStatus,
  readingStatusSchemaWithoutNone,
} from "@/types/readingStatus";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { is, safeParse } from "valibot";
import { LibraryBookList } from "./_components/LibraryBookList";
import Tab from "./_components/Tab";
import type { Metadata } from "next";
import { readingStatusMetadata } from "@/constants/status";

export const runtime = "edge";

type Props = {
  params: {
    status: ReadingStatus;
  };
  searchParams: {
    page?: string;
    order?: Order;
  };
};

export function generateMetadata({ params }: Props): Metadata {
  const readingStatus = readingStatusMetadata.get(params.status)

  if (!readingStatus || !is(readingStatusSchemaWithoutNone, params.status)) {
    notFound();
  }

  return generateMetadataTitle(readingStatus.label);
}

export default async function Library({ params, searchParams }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath(`/library/${params.status}`));
  }

  // ライブラリのステータスが不正な場合は404にリダイレクト
  if (!is(readingStatusSchemaWithoutNone, params.status)) {
    notFound();
  }

  // ページ数
  const pageParseResult = safeParse(
    pageIndexSchema,
    Number.parseInt(searchParams.page ?? "1"),
  );
  const page = pageParseResult.success ? pageParseResult.output : 1;

  // ソート順
  const orderParseResult = safeParse(orderSchema, searchParams.order);
  const orderType = orderParseResult.success ? orderParseResult.output : "desc";

  return (
    <>
      <Tab current={params.status} />
      <Suspense
        fallback={
          <Loading className="mt-12 lg:mt-0" title="読み込んでいます" />
        }
      >
        <LibraryBookList status={params.status} page={page} order={orderType} />
      </Suspense>
    </>
  );
}
