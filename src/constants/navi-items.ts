import IconBookmarksFilled from "@/assets/icons/bookmarks-filled.svg";
import IconBookmarks from "@/assets/icons/bookmarks.svg";
import IconScan from "@/assets/icons/scan.svg";
import IconSearch from "@/assets/icons/search.svg";
import IconSettingsFilled from "@/assets/icons/settings-filled.svg";
import IconSettings from "@/assets/icons/settings.svg";
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
    IconSolid: IconBookmarks,
    IconFilled: IconBookmarksFilled,
  },
  {
    title: "キーワードで探す",
    href: "/search",
    matchSegmentsRegExp: /^search$/,
    IconSolid: IconSearch,
    IconFilled: IconSearch,
  },
  {
    title: "バーコードで探す",
    href: "/search/barcode",
    matchSegmentsRegExp: /^search\/barcode/,
    IconSolid: IconScan,
    IconFilled: IconScan,
  },
  {
    title: "設定",
    href: "/settings",
    matchSegmentsRegExp: /^settings/,
    IconSolid: IconSettings,
    IconFilled: IconSettingsFilled,
  },
] as const;
