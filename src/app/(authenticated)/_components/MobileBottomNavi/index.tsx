import { naviItems } from "@/constants/navi-items";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import type { NaviProps } from "../../_types/navi";
import Link from "next/link";

export default function MobileBottomNavi({
  current,
  ...props
}: NaviProps & Omit<ComponentProps<"nav">, "className">) {
  return (
    <nav
      {...props}
      className="fixed bottom-4 left-4 flex w-[calc(100%-2rem)] justify-between rounded-full bg-card px-8 md:hidden"
    >
      {naviItems.map(({ title, href, IconSolid, IconFilled }) => {
        const isCurrent = title === current;
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
      })}
    </nav>
  );
}
