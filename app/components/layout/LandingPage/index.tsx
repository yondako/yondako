import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function LandingPageLayout({ children }: Props) {
  return (
    <body className="flex justify-center items-center h-full p-8 bg-gradation bg-left-top bg-no-repeat bg-[length:80%] md:bg-[length:50%]">
      {children}
    </body>
  );
}
