import { auth } from "@/lib/auth.server";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/url";
import { redirect } from "next/navigation";
import ErrorPage from "@/app/_components/ErrorPage";

export const runtime = "edge";

export const metadata = generateMetadataTitle("バーコードで探す");

export default async function SearchBarcode() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/search/barcode"));
  }

  return (
    <ErrorPage title="WIP...">
      <p>この機能は現在開発中です！</p>
      <p>実装までしばらくお待ちください 🐙</p>
    </ErrorPage>
  );
}
