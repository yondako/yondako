import { twMerge } from "tailwind-merge";
import "./globals.css";
import localFont from "next/font/local";

const fonts = localFont({
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={twMerge(
          "bg-background font-noto-emoji text-text",
          fonts.className,
        )}
      >
        {children}
      </body>
    </html>
  );
}
