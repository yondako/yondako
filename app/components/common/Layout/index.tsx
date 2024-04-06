import Footer from "@/components/common/Footer";
import type { ReactNode } from "react";
import Header from "../Header";
import type { MenuProps } from "../Menu";
import Menu from "../Menu";

type Props = {
  children: ReactNode;
} & MenuProps;

export default function CommonLayout({ children, ...props }: Props) {
  return (
    <body className="lg:flex">
      {/** モバイル幅のみ表示 */}
      <Header className="block lg:hidden" />

      <Menu className="hidden lg:shrink-0 lg:block" {...props} />
      <div className="shrink w-full h-full p-6 pt-4 lg:p-8">{children}</div>
      <Footer
        className="hidden lg:flex lg:shrink-0 lg:flex-col lg:justify-end items-start w-full max-w-64 h-full px-6 py-4 border-l border-line bg-background-sub"
        portrait
      />

      {/** モバイル幅のみ表示 */}
      <Footer className="block lg:hidden px-6 py-12 bg-background-sub" />
    </body>
  );
}
