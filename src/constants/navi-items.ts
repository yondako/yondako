import BookmarksFilled from "@/assets/icons/bookmarks-filled.svg";
import Bookmarks from "@/assets/icons/bookmarks.svg";
import Scan from "@/assets/icons/scan.svg";
import Search from "@/assets/icons/search.svg";
import SettingsFilled from "@/assets/icons/settings-filled.svg";
import Settings from "@/assets/icons/settings.svg";
import type { FunctionComponent, SVGProps } from "react";

export type NavItem = {
  /** ページタイトル */
  title: string;
  /** ページのパス */
  href: string;
  /**
   * 現在開いているページかどうかをチェックするための正規表現
   * useSelectedLayoutSegments().join("/") で取得した文字列とマッチするかどうかで判定しています
   */
  matchSegmentsRegExp: RegExp;
  /** 未選択時のアイコン */
  IconSolid: FunctionComponent<SVGProps<SVGElement>>;
  /** 選択時のアイコン */
  IconFilled: FunctionComponent<SVGProps<SVGElement>>;
};

export const naviItems = [
  {
    title: "ライブラリ",
    href: "/library/want_read",
    matchSegmentsRegExp: /^library/,
    IconSolid: Bookmarks,
    IconFilled: BookmarksFilled,
  },
  {
    title: "キーワードで探す",
    href: "/search",
    matchSegmentsRegExp: /^search$/,
    IconSolid: Search,
    IconFilled: Search,
  },
  {
    title: "バーコードで探す",
    href: "/search/barcode",
    matchSegmentsRegExp: /^search\/barcode$/,
    IconSolid: Scan,
    IconFilled: Scan,
  },
  {
    title: "設定",
    href: "/settings",
    matchSegmentsRegExp: /^settings/,
    IconSolid: Settings,
    IconFilled: SettingsFilled,
  },
] as const;
