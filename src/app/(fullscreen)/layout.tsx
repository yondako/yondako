import MobileBottomNavi from "@/components/MobileBottomNavi";
import Toaster from "@/components/Toaster";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Toaster />
      {children}
      {/* NOTE: 全画面でサイドバーを出すのもなんか変なので、とりあえずこれで */}
      <MobileBottomNavi />
    </>
  );
}
