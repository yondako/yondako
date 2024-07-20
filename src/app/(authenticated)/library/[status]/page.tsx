import type { ReadingStatus } from "@/types/book";
import Layout from "../../_components/Layout";
import Tab from "../_components/Tab";

type Props = {
  params: {
    status: ReadingStatus;
  };
};

export default function Library({ params }: Props) {
  return (
    <Layout current="ライブラリ">
      <Tab current={params.status} />
      <h1>Library</h1>
    </Layout>
  );
}
