import Footer from "@/components/Footer";
import MobileHeader from "../MobileHeader";
import SideNavi from "../SideNavi";
import MobileBottomNavi from "../MobileBottomNavi";
import type { ReactNode } from "react";
import type { NaviProps } from "../../_types/navi";

type Props = {
  children: ReactNode;
} & NaviProps;

export default function Layout({ children, ...props }: Props) {
  return (
    <div className="h-screen md:flex">
      <MobileHeader className="block md:hidden" />
      <SideNavi {...props} />

      <div className="min-h-full w-full px-6 py-8 md:shrink md:overflow-y-scroll md:px-12 ">
        {children}
      </div>

      <Footer className="block bg-background px-6 py-12 pb-32 text-center md:hidden" />
      <MobileBottomNavi {...props} />
    </div>
  );
}
