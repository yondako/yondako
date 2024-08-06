"use client";

import { naviItems } from "@/constants/navi-items";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { twMerge } from "tailwind-merge";

export default function MobileBottomNavi() {
  const segments = useSelectedLayoutSegments().join("/");

  return (
    <nav className="fixed bottom-4 left-4 flex w-[calc(100%-2rem)] justify-center rounded-full border-2 border-background bg-card md:hidden">
      <div className="flex w-full max-w-96 justify-between px-8">
        {naviItems.map(
          ({ title, href, matchSegmentsRegExp, IconSolid, IconFilled }) => {
            const isCurrent = matchSegmentsRegExp.test(segments);
            const Icon = isCurrent ? IconFilled : IconSolid;

            return (
              <Link
                className={twMerge(
                  "flex flex-col items-center p-4",
                  isCurrent && "text-tako",
                )}
                href={href}
                key={title}
              >
                <Icon className="h-7 w-7" />
              </Link>
            );
          },
        )}
      </div>
    </nav>
  );
}
