import type { ReactNode } from "react";
import { Toaster } from "sonner";
import MobileBottomNavi from "./_components/MobileBottomNavi";
import MobileHeader from "./_components/MobileHeader";
import SideNavi from "./_components/SideNavi";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="h-svh pb-20 lg:flex lg:pb-0">
      <Toaster
        richColors
        toastOptions={{
          className: "rounded-2xl text-base",
          descriptionClassName: "text-xs",
          style: {
            fontFamily: "var(--font-line-seed-jp)",
          },
        }}
      />
      <MobileHeader className="block lg:hidden" />
      <SideNavi className="hidden lg:flex" />
      <div className="flex h-full w-full flex-col px-6 py-8 lg:shrink lg:overflow-y-scroll lg:px-12 ">
        {children}
      </div>
      <MobileBottomNavi className="lg:hidden" />
    </div>
  );
}
