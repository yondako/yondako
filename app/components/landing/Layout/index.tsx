import Footer from "@/components/common/Footer";
import { SessionProvider } from "@hono/auth-js/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function LandingLayout({ children }: Props) {
  return (
    <SessionProvider>
      <body className="flex justify-center items-center h-full p-8 bg-gradation bg-left-top bg-no-repeat bg-[length:90%] sm:bg-[length:60%] lg:bg-[length:50%]">
        {children}
        <Footer className="fixed inset-x-0 bottom-8 text-center" />
      </body>
    </SessionProvider>
  );
}
