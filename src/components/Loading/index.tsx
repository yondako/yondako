"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { twMerge } from "tailwind-merge";

type Props = {
  title: string;
  className?: string;
};

export function Loading({ title, className }: Props) {
  return (
    <div className={twMerge("flex h-full flex-col items-center", className)}>
      <Player
        className="h-24 w-24"
        autoplay
        loop
        src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f419/lottie.json"
      />
      <p className="mt-3 text-sm tracking-wider">{title}</p>
    </div>
  );
}
