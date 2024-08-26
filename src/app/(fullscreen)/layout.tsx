import MobileBottomNavi from "@/components/MobileBottomNavi";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="relative max-h-svh bg-blue-500">
      {children}
      <MobileBottomNavi className="lg:hidden" />
    </div>
  );
}
