import type { ReactNode } from "react";
import MobileBottomNavi from "#src/components/MobileBottomNavi/index";
import Toaster from "#src/components/Toaster/index";
import { checkLatestNews } from "#src/lib/news";

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
