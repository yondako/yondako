import type { PropsWithChildren } from "react";
import MobileBottomNavi from "@/components/MobileBottomNavi";
import MobileHeader from "@/components/MobileHeader";
import Toaster from "@/components/Toast";
import SideNavi from "./_components/SideNavi";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-svh flex-col pb-20 lg:h-svh lg:flex-row lg:pb-0">
      <Toaster />
      <MobileHeader className="block text-accent lg:hidden" />
      <SideNavi className="hidden lg:flex" />
      <div className="flex h-full w-full flex-1 flex-col px-6 py-8 lg:shrink lg:overflow-y-scroll lg:px-12">
        {children}
      </div>
      <MobileBottomNavi className="lg:hidden" />
    </div>
  );
}
