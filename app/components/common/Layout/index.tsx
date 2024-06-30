import Footer from "@/components/common/Footer";
import type { NaviProps } from "@/types/navi";
import type { ReactNode } from "react";
import Header from "../Header";
import BottomNavi from "../Navi/Bottom";
import SideNavi from "../Navi/Side";

type Props = {
  children: ReactNode;
} & NaviProps;

export default function CommonLayout({ children, ...props }: Props) {
  return (
    <body className="md:flex h-full">
      {/** sm幅のみ */}
      <Header className="block md:hidden" />

      {/** md幅～のみ */}
      <SideNavi {...props} />

      <div className="w-full min-h-full px-6 md:px-12 py-8 md:overflow-y-scroll md:shrink ">
        {children}
      </div>

      {/** sm幅のみ */}
      <Footer className="block md:hidden px-6 py-12 pb-32 bg-background text-center" />
      <BottomNavi className="block md:hidden" {...props} />
    </body>
  );
}
