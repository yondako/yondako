import logoUrl from "@/assets/images/logo_portrait.svg?url";
import Footer from "@/components/Footer";
import { type NavItem, naviItems } from "@/constants/navi-items";
import { site } from "@/constants/site";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import type { NaviProps } from "../../_types/navi";

export default function SideNavi({
  current,
  ...props
}: NaviProps & ComponentProps<"nav">) {
  return (
    <nav
      {...props}
      className={twMerge(
        "hidden h-full w-full max-w-60 md:flex md:flex-col md:justify-between",
      )}
    >
      <div className="mt-8">
        <Link className="ml-8 block w-32" href="/">
          <Image src={logoUrl} alt={site.name} priority />
        </Link>

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
    <Link
      className={twMerge(
        "flex cursor-pointer items-center space-x-3 rounded-r-full px-8 py-2 text-base",
        current
          ? "bg-tako text-background"
          : "bg-background text-text transition hover:brightness-95",
      )}
      href={href}
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </Link>
  );
}
