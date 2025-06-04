import type { Close, Description, DialogProps, Title } from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

export type AdaptiveModalDrawerProps = {
  /** コンテンツ部分のクラス名 */
  contentClassName?: string;

  /** 中身 */
  children?: (components: {
    Title: typeof Title;
    Description: typeof Description;
    Close: typeof Close;
  }) => ReactNode;

  /** トリガー要素 */
  triggerChildren?: ReactNode;

  /** アニメーション終了時のコールバック */
  onAnimationEnd?: (open: boolean) => void;
} & Omit<DialogProps, "children">;
