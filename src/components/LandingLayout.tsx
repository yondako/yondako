import type { ReactNode } from "react";
import Footer from "./Footer";

type Props = Readonly<{
  children: ReactNode;
}>;

export default function LandingLayout({ children }: Props) {
  return (
    <main className="flex min-h-screen flex-col justify-end bg-[length:90vw] bg-[top_-20vw_right] bg-gradation bg-no-repeat p-8 sm:bg-[length:70vw] md:justify-center md:px-24 md:py-14 lg:bg-contain lg:bg-right">
      <div className="flex h-full w-full flex-col justify-between text-center md:w-fit md:text-left">
        <div className="mt-auto max-w-none md:my-auto md:max-w-[60vw]">
          {children}
        </div>
        <Footer className="mt-12" />
      </div>
    </main>
  );
}
