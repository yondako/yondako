import type { ReactNode } from "react";
import type { NaviProps } from "../../_types/navi";
import MobileBottomNavi from "../MobileBottomNavi";
import MobileHeader from "../MobileHeader";
import SideNavi from "../SideNavi";

type Props = {
  children: ReactNode;
} & NaviProps;

export default function Layout({ children, ...props }: Props) {
  return (
    <div className="pb-20 md:flex md:h-svh md:pb-0">
      <MobileHeader className="block md:hidden" />
      <SideNavi {...props} />

      <div className="flex h-full w-full flex-col px-6 py-8 md:shrink md:overflow-y-scroll md:px-12 ">
        {children}
      </div>

      <MobileBottomNavi {...props} />
    </div>
  );
}
