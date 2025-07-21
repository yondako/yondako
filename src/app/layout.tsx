import { twMerge } from "tailwind-merge";
import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import type { PropsWithChildren } from "react";
import { site } from "@/constants/site";
import { DeviceProvider } from "@/contexts/DeviceContext";
import { LibraryRevalidationProvider } from "@/contexts/LibraryRevalidationContext";
import { ModalStateProvider } from "@/contexts/ModalStateContext";
import { LINESeedJP } from "@/lib/font";
import { getIsDesktop } from "@/lib/getIsDesktop";
import UmamiScript from "./_components/UmamiScript";

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

export default async function RootLayout({ children }: Readonly<PropsWithChildren>) {
  const isDesktop = getIsDesktop(await headers());

  return (
    <html lang="ja">
      <body
        className={twMerge("bg-primary-background text-primary-foreground", LINESeedJP.className, LINESeedJP.variable)}
      >
        <UmamiScript />
        <DeviceProvider isDesktop={isDesktop}>
          <ModalStateProvider>
            <LibraryRevalidationProvider>{children}</LibraryRevalidationProvider>
          </ModalStateProvider>
        </DeviceProvider>
      </body>
    </html>
  );
}
