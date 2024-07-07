import { naviItems } from "@/constants/navi-items";
import type { NaviProps } from "@/types/navi";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function BottomNavi({
  current,
  ...props
}: NaviProps & ComponentProps<"nav">) {
  return (
    <nav
      {...props}
      className={twMerge(
        "fixed bottom-0 flex justify-between w-full px-8 border border-line bg-background",
        props.className,
      )}
    >
      {naviItems.map(({ title, short, href, Icon }) => {
        const isCurrent = title === current;

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
            <span className="text-xxs mt-1">{short}</span>
          </a>
        );
      })}
    </nav>
  );
}
