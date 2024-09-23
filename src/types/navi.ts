import type { ComponentPropsWithoutRef } from "react";

export type NaviProps = {
  /** 最新のお知らせの公開日時 */
  latestNewsPublishedAt: number;
} & ComponentPropsWithoutRef<"nav">;
