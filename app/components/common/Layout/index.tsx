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
      <SideNavi className="hidden md:grow md:block" {...props} />

      <div className="w-full min-h-full px-6 pt-4 md:px-8 md:pt-4 md:overflow-y-scroll md:shrink ">
        {children}
      </div>

      {/** lg幅～のみ */}
      <Footer
        className="hidden items-start w-full max-w-64 h-full px-6 py-4 lg:flex md:shrink-0 md:flex-col md:justify-end"
        portrait
      />

      {/** sm幅のみ */}
      <Footer className="block md:hidden px-6 py-12 pb-24 bg-background-sub" />
      <BottomNavi className="block md:hidden" {...props} />
    </body>
  );
}
