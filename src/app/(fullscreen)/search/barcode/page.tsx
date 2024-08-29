import { auth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Scanner = dynamic(() => import("./_components/Scanner"), {
  ssr: false,
});

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

  return <Scanner />;
}
