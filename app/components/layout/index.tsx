import type { ReactNode } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Menu, { type MenuProps } from "../Menu";

type Props = {
  children: ReactNode;
} & MenuProps;

export default function CommonLayout({ children, ...props }: Props) {
  return (
    <body className="md:flex">
      {/** スマホ幅でのみ表示 */}
      <Header className="block md:hidden" />

      <Menu className="hidden md:block" {...props} />
      <div className="w-full h-full p-6 pt-4 md:p-8">{children}</div>
      <Footer
        className="hidden md:flex md:flex-col md:justify-end items-start w-full max-w-64 h-full px-6 py-4 border-l border-line bg-background-sub"
        portrait
      />

      {/** スマホ幅でのみ表示 */}
      <Footer className="block md:hidden px-6 py-12 bg-background-sub" />
    </body>
  );
}
