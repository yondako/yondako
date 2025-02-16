import { auth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ScannerStartPage from "./_components/ScannerStartPage";

export const runtime = "edge";

export const metadata = generateMetadataTitle({
  pageTitle: "バーコードで探す",
  noindex: true,
});

export default async function SearchBarcode() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/search/barcode"));
  }

  const isDesktop = (await headers()).get("X-IS-DESKTOP") !== null;

  // デスクトップでは利用できないので、モバイルへの誘導ページへリダイレクト
  if (isDesktop) {
    redirect("/search/barcode/mobile-exclusive");
  }

  return <ScannerStartPage />;
}
