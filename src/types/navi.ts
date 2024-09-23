import type { ComponentPropsWithoutRef } from "react";

export type NaviProps = {
  /** 最新のお知らせのタイムスタンプ */
  latestNewsTimestamp: number;
} & ComponentPropsWithoutRef<"nav">;
