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
    <body className="md:flex">
      {/** モバイル幅のみ表示 */}
      <Header className="block md:hidden" />

      <Menu className="hidden md:shrink-0 md:block" {...props} />
      <div className="shrink w-full h-full p-6 pt-4 md:p-8">{children}</div>
      <Footer
        className="hidden md:flex md:shrink-0 md:flex-col md:justify-end items-start w-full max-w-64 h-full px-6 py-4 border-l border-line bg-background-sub"
        portrait
      />

      {/** モバイル幅のみ表示 */}
      <Footer className="block md:hidden px-6 py-12 bg-background-sub" />
    </body>
  );
}
