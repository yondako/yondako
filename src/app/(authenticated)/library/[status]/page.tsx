import { readingStatusSchemaWithoutNone } from "@/schemas/readingStatus";
import type { ReadingStatus } from "@/types/book";
import { notFound, redirect } from "next/navigation";
import { is } from "valibot";
import Layout from "../../_components/Layout";
import Tab from "../_components/Tab";
import { auth } from "@/lib/auth";

export const runtime = "edge";

type Props = {
  params: {
    status: ReadingStatus;
  };
};

export default async function Library({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    const callbackUrl = `/library/${params.status}`;
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  console.log(params.status);
  // ライブラリのステータスが不正な場合は404にリダイレクト
  if (!is(readingStatusSchemaWithoutNone, params.status)) {
    notFound();
  }

  return (
    <Layout current="ライブラリ">
      <Tab current={params.status} />
      <h1>Library</h1>
    </Layout>
  );
}
