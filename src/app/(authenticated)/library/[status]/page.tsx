import BookList from "@/components/BookList";
import { getBooksByReadingStatus } from "@/db/queries/status.server";
import { auth } from "@/lib/auth";
import { readingStatusSchemaWithoutNone } from "@/schemas/readingStatus";
import type { ReadingStatus } from "@/types/book";
import { notFound, redirect } from "next/navigation";
import { is } from "valibot";
import Layout from "../../_components/Layout";
import Tab from "../_components/Tab";

export const runtime = "edge";

type Props = {
  params: {
    status: ReadingStatus;
  };
};

export default async function Library({ params }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    const callbackUrl = `/library/${params.status}`;
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  // ライブラリのステータスが不正な場合は404にリダイレクト
  if (!is(readingStatusSchemaWithoutNone, params.status)) {
    notFound();
  }

  const books = await getBooksByReadingStatus(session.user.id, params.status);

  return (
    <Layout current="ライブラリ">
      <Tab current={params.status} />
      <BookList className="mt-10" items={books} hideReadingStatusBadge />
    </Layout>
  );
}
