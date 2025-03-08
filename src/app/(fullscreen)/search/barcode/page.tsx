import { PATH_SEARCH_BARCODE } from "@/constants/path";
import { getAuth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ScannerStartPage from "./_components/ScannerStartPage";

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

  const isDesktop = (await headers()).get("X-IS-DESKTOP") !== null;

  // デスクトップでは利用できないので、モバイルへの誘導ページへリダイレクト
  if (isDesktop) {
    redirect("/search/barcode/mobile-exclusive");
  }

  return <ScannerStartPage />;
}
