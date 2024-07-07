import logoUrl from "@/assets/images/logo_portrait.svg";
import { type NavItem, naviItems } from "@/constants/navi-items";
import { site } from "@/constants/site";
import type { NaviProps } from "@/types/navi";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import Footer from "../Footer";

export default function SideNavi({
  current,
  ...props
}: NaviProps & ComponentProps<"nav">) {
  return (
    <nav
      {...props}
      className={twMerge(
        "hidden md:flex md:flex-col md:justify-between w-full max-w-60 h-full",
      )}
    >
      <div className="mt-8">
        <a className="block w-32 ml-8" href="/">
          <img src={logoUrl} alt={site.name} />
        </a>

        <div className="mt-6 space-y-2">
          {naviItems.map((item) => (
            <Item {...item} current={item.title === current} key={item.title} />
          ))}
        </div>
      </div>

      <Footer className="mt-auto p-8" portrait />
    </nav>
  );
}

type ItemProps = {
  current?: boolean;
} & NavItem;

function Item({
  title,
  IconSolid,
  IconFilled,
  href,
  current = false,
}: ItemProps) {
  const Icon = current ? IconFilled : IconSolid;

  return (
    <a
      className={twMerge(
        "flex items-center px-8 py-2 text-base rounded-r-full space-x-3 cursor-pointer",
        current
          ? "text-background bg-tako"
          : "text-text bg-background transition hover:brightness-95",
      )}
      href={href}
    >
      <Icon className="w-5 h-5" />
      <span>{title}</span>
    </a>
  );
}
