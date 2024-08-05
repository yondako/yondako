import type { ReactNode } from "react";
import MobileBottomNavi from "./_components/MobileBottomNavi";
import MobileHeader from "./_components/MobileHeader";
import SideNavi from "./_components/SideNavi";

type Props = {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="pb-20 md:flex md:h-svh md:pb-0">
      <MobileHeader className="block md:hidden" />
      <SideNavi />
      <div className="flex h-full w-full flex-col px-6 py-8 md:shrink md:overflow-y-scroll md:px-12 ">
        {children}
      </div>
      <MobileBottomNavi />
    </div>
  );
}
