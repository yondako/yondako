import NotoColorEmojiTako from "@/assets/images/noto-color-emoji/emoji_u1f419.svg";
import type { ReactElement, ReactNode } from "react";
import { twJoin, twMerge } from "tailwind-merge";

export type MessageTakoProps = {
  title: string;
  decoration: ReactElement;
  children: ReactNode;
  landscape?: boolean;
  className?: string;
};

/**
 * メッセージを表示するタコキャラクターコンポーネント。タイトル、メッセージ内容、装飾要素を表示できます。
 */
export default function MessageTako({ title, decoration, children, landscape = false, className }: MessageTakoProps) {
  return (
    <div className={twMerge("mx-auto text-sm", landscape ? "flex items-center" : "text-center", className)}>
      <div className="relative mx-auto h-40 w-40">
        <NotoColorEmojiTako />
        {decoration}
      </div>
      <div className={twJoin(landscape ? "ml-6 h-fit" : "mt-6")}>
        <h2 className="font-bold text-2xl">{title}</h2>
        {children}
      </div>
    </div>
  );
}
