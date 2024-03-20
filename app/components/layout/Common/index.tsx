import { ReactNode } from "react";
import Menu from "./Menu";

type Props = {
  children: ReactNode;
};

export default function CommonLayout({ children }: Props) {
  return (
    <body className="flex">
      <Menu />
      <div className="w-full h-full">{children}</div>
      <div className="w-full max-w-64 h-full border-l border-line bg-background-sub">
        <p>right</p>
      </div>
    </body>
  );
}
