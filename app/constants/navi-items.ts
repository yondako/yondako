import {
  Bookmarks,
  BookmarksFilled,
  Scan,
  Search,
  Settings,
  SettingsFilled,
} from "@/components/common/Icons";
import { FunctionComponent, SVGProps } from "react";

export type NavItem = {
  title: string;
  short: string;
  href: `/${string}`;
  IconSolid: FunctionComponent<SVGProps<SVGSVGElement>>;
  IconFilled: FunctionComponent<SVGProps<SVGSVGElement>>;
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
