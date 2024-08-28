import { generateMetadataTitle } from "@/lib/metadata";
import dynamic from "next/dynamic";

const Scanner = dynamic(() => import("./_components/Scanner"), {
  ssr: false,
});

export const runtime = "edge";

export const metadata = generateMetadataTitle("バーコードで探す");

export default async function SearchBarcode() {
  // const session = await auth();

  // if (!session?.user?.id) {
  //   redirect(createSignInPath("/search/barcode"));
  // }

  return <Scanner />;
}
