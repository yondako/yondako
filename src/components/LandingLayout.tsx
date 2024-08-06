import type { ReactNode } from "react";
import Footer, { type FooterProps } from "./Footer";

type Props = Readonly<
  {
    children: ReactNode;
  } & Pick<FooterProps, "showTermsNotice">
>;

export default function LandingLayout({ children, showTermsNotice }: Props) {
  return (
    <div className="flex h-svh flex-col justify-between bg-[length:90vw] bg-[top_-20vw_right] bg-gradation bg-no-repeat p-8 sm:bg-[length:70vw] md:px-24 md:py-14 lg:bg-contain lg:bg-right">
      <div className="flex flex-1 items-end md:items-center">
        <div className="flex w-full flex-col text-center md:w-fit md:text-left">
          {children}
        </div>
      </div>

      <Footer
        className="mt-12 text-center md:mt-0 md:text-left"
        showTermsNotice={showTermsNotice}
      />
    </div>
  );
}
