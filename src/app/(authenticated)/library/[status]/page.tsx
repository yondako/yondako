import { Loading } from "@/components/Loading";
import { auth } from "@/lib/auth.server";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/url";
import { type Order, orderSchema } from "@/types/order";
import {
  type ReadingStatus,
  readingStatusSchemaWithoutNone,
} from "@/types/readingStatus";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { is, safeParse } from "valibot";
import Layout from "../../_components/Layout";
import Tab from "./_components/Tab";
import { LibraryBookList } from "./_components/LibraryBookList";

export const runtime = "edge";

export const metadata = generateMetadataTitle("ライブラリ");

type Props = {
  params: {
    status: ReadingStatus;
  };
  searchParams: {
    order?: Order;
  };
};

export default async function Library({ params, searchParams }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath(`/library/${params.status}`));
  }

  // ライブラリのステータスが不正な場合は404にリダイレクト
  if (!is(readingStatusSchemaWithoutNone, params.status)) {
    notFound();
  }

  // ソート順
  const orderParseResult = safeParse(orderSchema, searchParams.order);
  const orderType = orderParseResult.success ? orderParseResult.output : "desc";

  return (
    <Layout current="ライブラリ">
      <Tab current={params.status} />
      <Suspense fallback={<Loading title="読み込んでいます" />}>
        <LibraryBookList status={params.status} order={orderType} />
      </Suspense>
    </Layout>
  );
}
