import { naviItems } from "@/constants/navi-items";
import Link from "next/link";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import type { NaviProps } from "../../_types/navi";

export default function MobileBottomNavi({
  current,
  ...props
}: NaviProps & Omit<ComponentProps<"nav">, "className">) {
  return (
    <nav
      {...props}
      className="fixed bottom-4 left-4 flex w-[calc(100%-2rem)] justify-center rounded-full border-2 border-background bg-card md:hidden"
    >
      <div className="flex w-full max-w-96 justify-between px-8">
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
      </div>
    </nav>
  );
}
