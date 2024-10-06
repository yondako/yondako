import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "#src/lib/auth";
import { generateMetadataTitle } from "#src/lib/metadata";
import { createSignInPath } from "#src/lib/path";
import ScannerStartPage from "./_components/ScannerStartPage";

export const runtime = "edge";

export const metadata = generateMetadataTitle("バーコードで探す");

export default async function SearchBarcode() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/search/barcode"));
  }

  const isDesktop = headers().get("X-IS-DESKTOP") !== null;

  // デスクトップでは利用できないので、モバイルへの誘導ページへリダイレクト
  if (isDesktop) {
    redirect("/search/barcode/mobile-exclusive");
  }

  return <ScannerStartPage />;
}
