import BookList from "@/components/BookList";
import { getBooksByReadingStatus } from "@/db/queries/status.server";
import { auth } from "@/lib/auth.server";
import { readingStatusSchemaWithoutNone } from "@/schemas/readingStatus";
import type { ReadingStatus } from "@/types/book";
import { notFound, redirect } from "next/navigation";
import { is } from "valibot";
import Layout from "../../_components/Layout";
import Tab from "../_components/Tab";
import { createSignInPath } from "@/lib/url";
import { Suspense } from "react";
import { Loading } from "@/components/Loading";
import { generateMetadataTitle } from "@/lib/metadata";

export const runtime = "edge";

export const metadata = generateMetadataTitle("ライブラリ");

type Props = {
  params: {
    status: ReadingStatus;
  };
};

export default async function Library({ params }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath(`/library/${params.status}`));
  }

  // ライブラリのステータスが不正な場合は404にリダイレクト
  if (!is(readingStatusSchemaWithoutNone, params.status)) {
    notFound();
  }

  return (
    <Layout current="ライブラリ">
      <Tab current={params.status} />
      <Suspense fallback={<Loading title="読み込んでいます" />}>
        <LibraryBookList status={params.status} />
      </Suspense>
    </Layout>
  );
}

type LibraryBookListProps = {
  status: ReadingStatus;
};

async function LibraryBookList({ status }: LibraryBookListProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const books = await getBooksByReadingStatus(session.user.id, status);

  return (
    <div className="mt-10">
      <BookList items={books} hideReadingStatusBadge />
    </div>
  );
}
