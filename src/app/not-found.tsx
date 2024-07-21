import Button from "@/components/Button";
import LandingLayout from "@/components/LandingLayout";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NotFound | yondako",
};

export default function NotFound() {
  return (
    <LandingLayout>
      <h1 className="font-bold text-4xl tracking-wide md:text-5xl">NotFound</h1>
      <p className="mt-10">ページが見つかりませんでした 🫥</p>
      <p className="mt-1">URLが間違っていないかご確認ください</p>
      <Button asChild>
        <Link className="mx-auto mt-10 block w-fit text-base md:mx-0" href="/">
          <span className="font-noto-emoji">🐙</span>
          <span className="ml-2">トップページに戻る</span>
        </Link>
      </Button>
    </LandingLayout>
  );
}
