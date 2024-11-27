import localFont from "next/font/local";

export const LINESeedJP = localFont({
  src: [
    {
      path: "../assets/fonts/LINESeedJP_OTF_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/LINESeedJP_OTF_Bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-line-seed-jp",
});
