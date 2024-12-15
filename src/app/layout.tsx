import { twMerge } from "tailwind-merge";
import "./globals.css";
import { site } from "@/constants/site";
import { LINESeedJP } from "@/lib/font";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  description: site.description.long,
  metadataBase: new URL(site.url),
  openGraph: {
    description: site.description.long,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    description: site.description.long,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL &&
          process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
            <Script
              src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
              strategy="lazyOnload"
            />
          )}
      </head>
      <body
        className={twMerge(
          "bg-primary-background text-primary-foreground",
          LINESeedJP.className,
          LINESeedJP.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
