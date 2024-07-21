import { auth } from "@/lib/auth.server";
import Layout from "../../_components/Layout";

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
