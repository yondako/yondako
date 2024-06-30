import Footer from "@/components/common/Footer";
import { SessionProvider } from "@hono/auth-js/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function LandingLayout({ children }: Props) {
  return (
    <SessionProvider>
      <body className="h-full p-24 bg-gradation bg-right bg-contain bg-no-repeat">
        <div className="w-fit h-full flex flex-col justify-between">
          {children}
        </div>
        <Footer />
      </body>
    </SessionProvider>
  );
}
