import { IconBooks } from "@/components/common/Icon/Books";
import { IconLogout } from "@/components/common/Icon/Logout";
import { IconScan } from "@/components/common/Icon/Scan";
import { IconSearch } from "@/components/common/Icon/Search";
import type { IconType } from "@/types/icon";

export type NavItem = {
  title: string;
  short: string;
  href: `/${string}`;
  Icon: IconType;
};

export const naviItems: NavItem[] = [
  {
    title: "ライブラリ",
    short: "ライブラリ",
    href: "/library",
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
    title: "ログアウト",
    short: "ログアウト",
    href: "/",
    Icon: IconLogout,
  },
] as const;
