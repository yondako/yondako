import type { PropsWithChildren } from "react";
import MobileBottomNavi from "@/components/MobileBottomNavi";
import Toaster from "@/components/Toast";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Toaster />
      {children}
      {/* NOTE: 全画面でサイドバーを出すのもなんか変なので、とりあえずこれで */}
      <MobileBottomNavi />
    </>
  );
}
