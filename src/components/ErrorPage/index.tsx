import Link from "next/link";
import type { ReactNode } from "react";
import NotoColorEmojiTako from "@/assets/images/noto-color-emoji/emoji_u1f419.svg";
import Button from "@/components/Button";
import LandingLayout from "@/components/LandingLayout";

type Props = {
  title: string;
  children: ReactNode;
};

/**
 * エラー画面を表示するコンポーネント。エラータイトルと説明文、タコのイラストを表示します。
 */
export default function ErrorPage({ title, children }: Props) {
  return (
    <LandingLayout>
      <h1 className="font-bold text-4xl tracking-wide md:text-5xl">{title}</h1>
      <div className="mt-10 space-y-1">{children}</div>
      <Button style="accent" asChild>
        <Link className="mx-auto mt-10 flex w-fit items-center text-sm md:mx-0" href="/">
          <NotoColorEmojiTako className="h-5 w-5" />
          <span className="ml-2">トップページに戻る</span>
        </Link>
      </Button>
    </LandingLayout>
  );
}
