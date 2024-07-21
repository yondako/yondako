import BookList from "@/components/BookList";
import { Loading } from "@/components/Loading";
import { getBooksByReadingStatus } from "@/db/queries/status.server";
import { auth } from "@/lib/auth.server";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/url";
import {
  type ReadingStatus,
  readingStatusSchemaWithoutNone,
} from "@/types/readingStatus";
import { notFound, redirect } from "next/navigation";
import Button from "@/components/Button";
import IconSortAsc from "@/assets/icons/sort-ascending.svg";
import IconSortDesc from "@/assets/icons/sort-descending.svg";
import { Suspense } from "react";
import { is, safeParse } from "valibot";
import Layout from "../../_components/Layout";
import Tab from "../_components/Tab";
import { orderSchema } from "@/types/order";

export const runtime = "edge";

export const metadata = generateMetadataTitle("ライブラリ");

type Props = {
  params: {
    status: ReadingStatus;
  };
  searchParams: {
    order?: "asc" | "desc";
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

type LibraryBookListProps = {
  status: ReadingStatus;
  order: "asc" | "desc";
};

async function LibraryBookList({ status }: LibraryBookListProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const books = await getBooksByReadingStatus(session.user.id, status, "desc");

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between space-x-4">
        <h1 className="font-bold">
          <span className="text-4xl">{books.length}</span>
          <span className="text-base">冊</span>
        </h1>
        <Button className="inline-flex h-fit items-center space-x-1 px-4 py-1 text-xs">
          <IconSortDesc className="h-5" />
          <span>登録日が新しい順</span>
        </Button>
      </div>
      <BookList items={books} hideReadingStatusBadge />
    </div>
  );
}
