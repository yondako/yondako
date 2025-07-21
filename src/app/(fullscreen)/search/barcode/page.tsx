import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PATH_SEARCH_BARCODE } from "@/constants/path";
import { getAuth } from "@/lib/auth";
import { getIsDesktop } from "@/lib/getIsDesktop";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import ScannerStartPage from "./_components/ScannerStartPage";

export const dynamic = "force-dynamic";

export const metadata = generateMetadataTitle({
  pageTitle: "バーコードで探す",
  noindex: true,
});

export default async function SearchBarcode() {
  const { env } = await getCloudflareContext({
    async: true,
  });

  const auth = getAuth(env.DB);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect(createSignInPath(PATH_SEARCH_BARCODE));
  }

  const isDesktop = getIsDesktop(await headers());

  // デスクトップでは利用できないので、モバイルへの誘導ページへリダイレクト
  if (isDesktop) {
    redirect("/search/barcode/mobile-exclusive");
  }

  return <ScannerStartPage />;
}
