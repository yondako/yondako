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
    <body className="lg:flex h-full">
      {/** モバイル幅のみ */}
      <Header className="block lg:hidden" />

      {/** デスクトップ幅のみ */}
      <SideNavi className="hidden lg:grow lg:block" {...props} />

      <div className="w-full min-h-full p-6 pt-4 lg:p-8 lg:overflow-y-scroll lg:shrink ">
        {children}
      </div>

      {/** デスクトップ幅のみ */}
      <Footer
        className="hidden items-start w-full max-w-64 h-full px-6 py-4 border-l border-line bg-background-sub lg:flex lg:shrink-0 lg:flex-col lg:justify-end"
        portrait
      />

      {/** モバイル幅のみ表示 */}
      <Footer className="block lg:hidden px-6 py-12 pb-24 bg-background-sub" />
      <BottomNavi className="block lg:hidden" {...props} />
    </body>
  );
}
