import logoUrl from "@/assets/images/logo_portrait.svg";
import { type NavItem, naviItems } from "@/constants/navi-items";
import { site } from "@/constants/site";
import { classNames } from "@/libs/classNames";
import type { NaviProps } from "@/types/navi";
import { ComponentProps } from "react";

export default function SideNavi({
  current,
  ...props
}: NaviProps & ComponentProps<"nav">) {
  const style = "w-full max-w-64 h-full";

  return (
    <nav {...props} className={classNames(style, props.className)}>
      <div className="px-8 py-6 bg-gradation bg-left-top bg-no-repeat bg-[length:45%]">
        <a className="block w-fit" href="/">
          <img width={110} src={logoUrl} alt={site.name} />
        </a>
      </div>

      <div className="mt-2 pr-4 space-y-2">
        {naviItems.map((item) => (
          <Item {...item} current={item.title === current} key={item.title} />
        ))}
      </div>
    </nav>
  );
}

type ItemProps = {
  current?: boolean;
} & NavItem;

function Item({ title, Icon, href, current = false }: ItemProps) {
  const style = current
    ? "text-background bg-tako"
    : "text-text bg-background transition hover:brightness-95";

  return (
    <a
      className={classNames(
        "flex items-center px-8 py-2 text-base rounded-r-full space-x-3 cursor-pointer",
        style,
      )}
      href={href}
    >
      <Icon className="w-5 h-5" />
      <span>{title}</span>
    </a>
  );
}
