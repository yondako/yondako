import MobileBottomNavi from "@/components/MobileBottomNavi";
import MobileHeader from "@/components/MobileHeader";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import SideNavi from "./_components/SideNavi";

const Toaster = dynamic(import("@/components/Toaster"), {
  ssr: false,
});

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-svh pb-20 lg:flex lg:h-svh lg:pb-0">
      <Toaster />
      <MobileHeader className="block text-accent lg:hidden" />
      <SideNavi className="hidden lg:flex" />
      <div className="flex h-full w-full flex-col px-6 py-8 lg:shrink lg:overflow-y-scroll lg:px-12 ">
        {children}
      </div>
      <MobileBottomNavi className="lg:hidden" />
    </div>
  );
}
