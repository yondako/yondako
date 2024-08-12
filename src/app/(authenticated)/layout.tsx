import type { ReactNode } from "react";
import MobileBottomNavi from "./_components/MobileBottomNavi";
import MobileHeader from "./_components/MobileHeader";
import SideNavi from "./_components/SideNavi";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="pb-20 lg:flex lg:h-svh lg:pb-0">
      <MobileHeader className="block lg:hidden" />
      <SideNavi className="hidden lg:flex" />
      <div className="flex h-full w-full flex-col px-6 py-8 lg:shrink lg:overflow-y-scroll lg:px-12 ">
        {children}
      </div>
      <MobileBottomNavi className="lg:hidden" />
    </div>
  );
}
