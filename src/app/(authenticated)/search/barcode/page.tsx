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
    <div className="my-auto text-center">
      <p className="ml-3 rotate-12 text-3xl">⚒️</p>
      <p className="font-noto-emoji text-5xl">🐙</p>
      <p className="mt-3 text-sm">現在開発中です…！</p>
    </div>
  );
}
