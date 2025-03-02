import ImageQrCode from "@/assets/images/qr-search-barcode.svg";
import MessageTako from "@/components/MessageTako";
import { PATH_SEARCH_BARCODE_MOBILE_EXCLUSIVE } from "@/constants/path";
import { getAuth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = generateMetadataTitle({
  pageTitle: "バーコードで探す",
  noindex: true,
});

export default async function MobileExclusive() {
  const { env } = await getCloudflareContext({
    async: true,
  });

  const auth = getAuth(env.DB);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect(createSignInPath(PATH_SEARCH_BARCODE_MOBILE_EXCLUSIVE));
  }

  const isMobile = (await headers()).get("X-IS-DESKTOP") === null;

  // モバイルであれば利用可能なのでリダイレクト
  if (isMobile) {
    redirect("/search/barcode");
  }

  return (
    <div className="flex h-full items-center">
      <MessageTako
        title="この機能はスマホからのみ利用可能です"
        decoration={
          <>
            <span className="absolute top-0 left-0 text-4xl">📱</span>
            <span className="-right-2 absolute bottom-7 text-3xl">💻️</span>
          </>
        }
      >
        <p className="mt-3">よかったらスマホからアクセスしてみてください 🙏</p>
        <p className="mt-1 text-xs">
          (需要があれば、デスクトップ対応するかもしれません)
        </p>
        <div className="mx-auto mt-12 w-48 rounded-2xl bg-tertiary-background p-4">
          <ImageQrCode className="text-accent" />
        </div>
      </MessageTako>
    </div>
  );
}
