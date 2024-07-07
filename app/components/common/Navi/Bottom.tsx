import { naviItems } from "@/constants/navi-items";
import type { NaviProps } from "@/types/navi";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function BottomNavi({
  current,
  ...props
}: NaviProps & Omit<ComponentProps<"nav">, "className">) {
  return (
    <nav
      {...props}
      className="fixed bottom-4 left-4 flex md:hidden justify-between w-[calc(100%-2rem)] px-8 rounded-full bg-card"
    >
      {naviItems.map(({ title, href, IconSolid, IconFilled }) => {
        const isCurrent = title === current;
        const Icon = isCurrent ? IconFilled : IconSolid;

        return (
          <a
            className={twMerge(
              "flex flex-col items-center p-4",
              isCurrent && "text-tako",
            )}
            href={href}
            key={title}
          >
            <Icon className="w-7 h-7" />
          </a>
        );
      })}
    </nav>
  );
}
