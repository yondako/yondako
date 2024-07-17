import BookmarksFilled from "@/assets/icons/bookmarks-filled.svg";
import Bookmarks from "@/assets/icons/bookmarks.svg";
import Scan from "@/assets/icons/scan.svg";
import Search from "@/assets/icons/search.svg";
import SettingsFilled from "@/assets/icons/settings-filled.svg";
import Settings from "@/assets/icons/settings.svg";
import type { FunctionComponent, SVGProps } from "react";

export type NavItem = {
  title: string;
  short: string;
  href: `/${string}`;
  IconSolid: FunctionComponent<SVGProps<SVGElement>>;
  IconFilled: FunctionComponent<SVGProps<SVGElement>>;
};

export const naviItems: NavItem[] = [
  {
    title: "ライブラリ",
    short: "ライブラリ",
    href: "/library/reading",
    IconSolid: Bookmarks,
    IconFilled: BookmarksFilled,
  },
  {
    title: "キーワードで探す",
    short: "キーワードで",
    href: "/search",
    IconSolid: Search,
    IconFilled: Search,
  },
  {
    title: "バーコードで探す",
    short: "バーコードで",
    href: "/search/barcode",
    IconSolid: Scan,
    IconFilled: Scan,
  },
  {
    title: "設定",
    short: "設定",
    href: "/settings",
    IconSolid: Settings,
    IconFilled: SettingsFilled,
  },
] as const;
