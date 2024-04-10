import { naviItems } from "@/constants/navi-items";
import { classNames } from "@/libs/classNames";
import type { NaviProps } from "@/types/navi";

export default function BottomNavi({
  current,
  ...props
}: NaviProps & JSX.IntrinsicElements["nav"]) {
  return (
    <nav
      {...props}
      className={classNames(
        "fixed bottom-0 flex justify-between w-full px-8 border-t border-line bg-background",
        props.className,
      )}
    >
      {naviItems.map((item) => {
        const isCurrent = item.title === current;

        return (
          <a
            className={classNames("p-4", isCurrent && "text-tako")}
            href={item.href}
            key={item.title}
          >
            <item.Icon className="w-7 h-7" />
          </a>
        );
      })}
    </nav>
  );
}
