import type { ReactNode } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import NotoColorEmojiTako from "#src/assets/images/noto-color-emoji/emoji_u1f419.svg";

export type MessageTakoProps = {
  title: string;
  decoration: JSX.Element;
  children: ReactNode;
  landscape?: boolean;
  className?: string;
};

export default function MessageTako({
  title,
  decoration,
  children,
  landscape = false,
  className,
}: MessageTakoProps) {
  return (
    <div
      className={twMerge(
        "mx-auto text-sm",
        landscape ? "flex items-center" : "text-center",
        className,
      )}
    >
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
