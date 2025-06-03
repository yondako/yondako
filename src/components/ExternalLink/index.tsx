import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

/**
 * 外部リンクを表示するコンポーネント。新しいタブで開くリンクに外部リンクアイコンを自動的に追加します。
 */
export default function ExternalLink({ className, ...props }: Omit<ComponentPropsWithoutRef<"a">, "target" | "rel">) {
  return (
    <a
      {...props}
      className={twMerge("transition-colors hover:text-accent hover:underline", className)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  );
}
