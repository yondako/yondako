"use client";

import { naviItems } from "@/constants/navi-items";
import { checkForNewNews } from "@/lib/lastNewsCheckedAt";
import type { NaviProps } from "@/types/navi";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { twMerge } from "tailwind-merge";

export default function MobileBottomNavi({
  latestNewsPublishedAt,
  className,
  ...props
}: NaviProps) {
  const segments = useSelectedLayoutSegments().join("/");
  const hasNewNews = checkForNewNews(latestNewsPublishedAt);

  return (
    <nav
      {...props}
      className={twMerge(
        "sm:-translate-x-1/2 fixed bottom-4 left-4 flex w-[calc(100%-2rem)] justify-center rounded-full border-2 border-primary-background bg-tertiary-background shadow-sm sm:left-1/2 sm:max-w-md",
        className,
      )}
    >
      <div className="flex w-full max-w-96 justify-between px-8">
        {naviItems.map(
          ({ title, href, matchSegmentsRegExp, IconSolid, IconFilled }) => {
            const isCurrent = matchSegmentsRegExp.test(segments);
            const Icon = isCurrent ? IconFilled : IconSolid;
            const to = typeof href === "string" ? href : href.mobile;
            const badge = title === "お知らせ" && hasNewNews;

            return (
              <Link
                className={twMerge(
                  "relative flex w-full flex-col items-center py-4",
                  isCurrent && "text-accent",
                )}
                href={to}
                key={title}
              >
                {badge && (
                  <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-400 outline outline-2 outline-primary-background outline-offset-0" />
                )}
                <Icon className="h-7 w-7" />
              </Link>
            );
          },
        )}
      </div>
    </nav>
  );
}
