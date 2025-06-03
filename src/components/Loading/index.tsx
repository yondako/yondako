"use client";

import imageTako from "@/assets/images/animation-emoji/1f419.gif";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

type Props = {
  title: string;
  className?: string;
};

/**
 * ローディング状態を表示するコンポーネント。タコのアニメーションGIFとタイトルを表示します。
 */
export function Loading({ title, className }: Props) {
  return (
    <div className={twMerge("flex h-full flex-col items-center", className)}>
      <Image
        className="h-24 w-24"
        src={imageTako}
        alt="踊るタコ"
        unoptimized
        data-testid="animation-tako"
      />
      <p className="mt-3 text-sm tracking-wider">{title}</p>
    </div>
  );
}
