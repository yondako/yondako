import type { IconType } from "react-icons";
import { FiSearch } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { PiBarcode, PiBarcodeFill, PiBooks, PiBooksFill } from "react-icons/pi";

export type NavItem = {
  title: string;
  href: `/${string}`;
  LineIcon: IconType;
  FillIcon: IconType;
};

export const naviItems: NavItem[] = [
  {
    title: "ライブラリ",
    href: "/library",
    LineIcon: PiBooks,
    FillIcon: PiBooksFill,
  },
  {
    title: "キーワードで探す",
    href: "/search",
    LineIcon: FiSearch,
    FillIcon: FiSearch,
  },
  {
    title: "バーコードで探す",
    href: "/search/barcode",
    LineIcon: PiBarcode,
    FillIcon: PiBarcodeFill,
  },
  {
    title: "ログアウト",
    href: "/",
    LineIcon: MdLogout,
    FillIcon: MdLogout,
  },
] as const;
