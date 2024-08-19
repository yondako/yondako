import NotoColorEmojiTako from "@/assets/images/noto-color-emoji/emoji_u1f419.svg";
import { auth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import { redirect } from "next/navigation";

export const runtime = "edge";

export const metadata = generateMetadataTitle("バーコードで探す");

export default async function SearchBarcode() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/search/barcode"));
  }

  return (
    <div className="mx-auto my-auto text-center">
      <div className="relative mx-auto w-fit">
        <p className="-z-10 -bottom-4 absolute left-14 text-4xl">🧰</p>
        <p className="-top-1 -right-3 absolute rotate-12 text-5xl">⚒️</p>
        <NotoColorEmojiTako className="h-32 w-32" />
      </div>
      <h2 className="mt-12 font-bold text-2xl">現在開発中です！</h2>
      <p className="mt-3 text-sm">実装までもう少しお待ちください。</p>
    </div>
  );
}
