import Footer from "@/components/common/Footer";
import { SessionProvider } from "@hono/auth-js/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function LandingLayout({ children }: Props) {
  return (
    <SessionProvider>
      <body className="h-full p-8 md:px-24 md:py-14 bg-gradation bg-[top_-20vw_right] lg:bg-right bg-[length:90vw] sm:bg-[length:70vw] lg:bg-contain bg-no-repeat">
        <div className="w-full md:w-fit h-full flex flex-col justify-between">
          {children}
          <Footer className="mt-12 text-center md:text-left" />
        </div>
      </body>
    </SessionProvider>
  );
}
