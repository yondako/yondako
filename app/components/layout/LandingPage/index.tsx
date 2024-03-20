import { ReactNode } from "react";
import Footer from "../../common/Footer";

type Props = {
  children: ReactNode;
};

export default function LandingPageLayout({ children }: Props) {
  return (
    <body className="flex justify-center items-center h-full p-8 bg-gradation bg-left-top bg-no-repeat bg-[length:80%] md:bg-[length:50%]">
      {children}
      <Footer className="fixed inset-x-0 bottom-8 text-center" />
    </body>
  );
}