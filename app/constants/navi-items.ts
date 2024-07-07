import { Books, Scan, Search, Settings } from "@/components/common/Icons";
import { FunctionComponent, SVGProps } from "react";

export type NavItem = {
  title: string;
  short: string;
  href: `/${string}`;
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
};

export const naviItems: NavItem[] = [
  {
    title: "ライブラリ",
    short: "ライブラリ",
    href: "/library/reading",
    Icon: Books,
  },
  {
    title: "キーワードで探す",
    short: "キーワードで",
    href: "/search",
    Icon: Search,
  },
  {
    title: "バーコードで探す",
    short: "バーコードで",
    href: "/search/barcode",
    Icon: Scan,
  },
  {
    title: "設定",
    short: "設定",
    href: "/settings",
    Icon: Settings,
  },
] as const;
