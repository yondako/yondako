import MobileBottomNavi from "@/components/MobileBottomNavi";
import MobileHeader from "@/components/MobileHeader";
import { checkLatestNews } from "@/lib/news";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import UmamiScript from "../_components/UmamiScript";
import SideNavi from "./_components/SideNavi";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  // 最新のお知らせを確認
  // NOTE: 頻繁に更新されるものではないのでここで確認でOK
  const latestNewsTimestamp = await checkLatestNews();

  return (
    <>
      <UmamiScript />
      <div className="flex min-h-svh flex-col pb-20 lg:h-svh lg:flex-row lg:pb-0">
        <Toaster />
        <MobileHeader className="block text-accent lg:hidden" />
        <SideNavi className="hidden lg:flex" latestNewsTimestamp={latestNewsTimestamp} />
        <div className="flex h-full w-full flex-1 flex-col px-6 py-8 lg:shrink lg:overflow-y-scroll lg:px-12">
          {children}
        </div>
        <MobileBottomNavi className="lg:hidden" latestNewsTimestamp={latestNewsTimestamp} />
      </div>
    </>
  );
}
