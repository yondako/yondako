import MobileBottomNavi from "@/components/MobileBottomNavi";
import Toaster from "@/components/Toast";
import type { ReactNode } from "react";
import UmamiScript from "../_components/UmamiScript";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  return (
    <>
      <UmamiScript />
      <Toaster />
      {children}
      {/* NOTE: 全画面でサイドバーを出すのもなんか変なので、とりあえずこれで */}
      <MobileBottomNavi />
    </>
  );
}
