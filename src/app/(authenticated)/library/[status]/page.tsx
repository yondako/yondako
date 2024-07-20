import type { ReadingStatus } from "@/types/book";
import Layout from "../../_components/Layout";
import Tab from "../_components/Tab";
import { readingStatusSchemaWithoutNone } from "@/schemas/readingStatus";
import { is } from "valibot";
import { notFound } from "next/navigation";

type Props = {
  params: {
    status: ReadingStatus;
  };
};

export default function Library({ params }: Props) {
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
