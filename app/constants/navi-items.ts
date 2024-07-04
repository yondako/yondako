import IconBooks from "@/assets/icons/books.svg?react";
import IconScan from "@/assets/icons/scan.svg?react";
import IconSearch from "@/assets/icons/search.svg?react";
import IconSetting from "@/assets/icons/settings.svg?react";
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
    Icon: IconBooks,
  },
  {
    title: "キーワードで探す",
    short: "キーワードで",
    href: "/search",
    Icon: IconSearch,
  },
  {
    title: "バーコードで探す",
    short: "バーコードで",
    href: "/search/barcode",
    Icon: IconScan,
  },
  {
    title: "設定",
    short: "設定",
    href: "/settings",
    Icon: IconSetting,
  },
] as const;
