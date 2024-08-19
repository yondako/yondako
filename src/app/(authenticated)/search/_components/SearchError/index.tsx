import NotoColorEmojiTako from "@/assets/images/noto-color-emoji/emoji_u1f419.svg";
import type { ReactNode } from "react";

type Props = {
  title: string;
  decoration: JSX.Element;
  children: ReactNode;
};

export default function SearchError({ title, decoration, children }: Props) {
  return (
    <div className="mx-auto mt-16 text-center text-sm">
      <div className="relative mx-auto h-40 w-40">
        <NotoColorEmojiTako />
        {decoration}
      </div>
      <h2 className="mt-6 font-bold text-2xl">{title}</h2>
      {children}
    </div>
  );
}
