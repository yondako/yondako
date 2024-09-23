"use client";

import logoUrl from "@/assets/images/logo/portrait.svg?url";
import Footer from "@/components/Footer";
import { naviItems } from "@/constants/navi-items";
import { site } from "@/constants/site";
import { checkForNewNews } from "@/lib/news";
import type { NaviProps } from "@/types/navi";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { twMerge } from "tailwind-merge";
import Item from "./Item";

export default function SideNavi({
  latestNewsTimestamp: latestNewsPublishedAt,
  className,
  ...props
}: NaviProps) {
  const segments = useSelectedLayoutSegments().join("/");
  const hasNewNews = checkForNewNews(latestNewsPublishedAt);

  return (
    <nav
      {...props}
      className={twMerge(
        "flex h-full w-full max-w-60 flex-col justify-between",
        className,
      )}
    >
      <div className="mt-8">
        <Link className="ml-8 block w-32" href="/">
          <Image src={logoUrl} alt={site.name} priority />
          <p className="text-accent text-xs">ver.beta</p>
        </Link>

        <div className="mt-6 space-y-2">
          {naviItems.map(({ matchSegmentsRegExp, ...item }) => {
            const badge = item.title === "お知らせ" && hasNewNews;

            return (
              <Item
                {...item}
                key={item.title}
                current={matchSegmentsRegExp.test(segments)}
                badge={badge}
              />
            );
          })}
        </div>
      </div>

      <Footer className="mt-auto p-8" portrait />
    </nav>
  );
}
