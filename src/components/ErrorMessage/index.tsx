import NotoColorEmojiTako from "@/assets/images/noto-color-emoji/emoji_u1f419.svg";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  title: string;
  decoration: JSX.Element;
  children: ReactNode;
  className?: string;
};

export default function ErrorMessage({
  title,
  decoration,
  children,
  className,
}: Props) {
  return (
    <div className={twMerge("mx-auto mt-16 text-center text-sm", className)}>
      <div className="relative mx-auto h-40 w-40">
        <NotoColorEmojiTako />
        {decoration}
      </div>
      <h2 className="mt-6 font-bold text-2xl">{title}</h2>
      {children}
    </div>
  );
}
