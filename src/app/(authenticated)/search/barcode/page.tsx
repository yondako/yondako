import { auth } from "@/lib/auth.server";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/url";
import { redirect } from "next/navigation";
import Layout from "../../_components/Layout";

export const runtime = "edge";

export const metadata = generateMetadataTitle("バーコードで探す");

export default async function SearchBarcode() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/search/barcode"));
  }

  return (
    <Layout current="バーコードで探す">
      <h1>barcode</h1>
    </Layout>
  );
}
