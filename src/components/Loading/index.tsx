"use client";

import NotoColorEmojiTako from "@/assets/images/noto-color-emoji/emoji_u1f419.svg";
import dynamic from "next/dynamic";
import { twMerge } from "tailwind-merge";

// NOTE:
// Cloudflare Pages のデプロイ環境で "document is not defined" が出ていたので、
// Lottie アニメーション部分を別コンポーネントにして dynamic import することで回避しています
const AnimationTako = dynamic(() => import("./AnimationTako"), {
  loading: () => <NotoColorEmojiTako className="h-24 w-24" />,
  ssr: false,
});

type Props = {
  title: string;
  className?: string;
};

export function Loading({ title, className }: Props) {
  return (
    <div className={twMerge("flex h-full flex-col items-center", className)}>
      <AnimationTako />
      <p className="mt-3 text-sm tracking-wider">{title}</p>
    </div>
  );
}
