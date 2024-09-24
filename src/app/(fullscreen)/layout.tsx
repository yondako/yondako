import MobileBottomNavi from "@/components/MobileBottomNavi";
import Toaster from "@/components/Toaster";
import { checkLatestNews } from "@/lib/news";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const latestNewsTimestamp = await checkLatestNews();

  return (
    <>
      <Toaster />
      {children}
      {/* NOTE: 全画面でサイドバーを出すのもなんか変なので、とりあえずこれで */}
      <MobileBottomNavi latestNewsTimestamp={latestNewsTimestamp} />
    </>
  );
}
