import { IconBooks } from "@/components/common/Icon/Books";
import { IconLogout } from "@/components/common/Icon/Logout";
import { IconScan } from "@/components/common/Icon/Scan";
import { IconSearch } from "@/components/common/Icon/Search";
import type { IconType } from "@/types/icon";

export type NavItem = {
  title: string;
  href: `/${string}`;
  Icon: IconType;
};

export const naviItems: NavItem[] = [
  {
    title: "ライブラリ",
    href: "/library",
    Icon: IconBooks,
  },
  {
    title: "キーワードで探す",
    href: "/search",
    Icon: IconSearch,
  },
  {
    title: "バーコードで探す",
    href: "/search/barcode",
    Icon: IconScan,
  },
  {
    title: "ログアウト",
    href: "/",
    Icon: IconLogout,
  },
] as const;
