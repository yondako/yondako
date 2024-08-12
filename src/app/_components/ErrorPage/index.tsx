import Button from "@/components/Button";
import LandingLayout from "@/components/LandingLayout";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function ErrorPage({ title, children }: Props) {
  return (
    <LandingLayout>
      <h1 className="font-bold text-4xl tracking-wide md:text-5xl">{title}</h1>
      <div className="mt-10 space-y-1">{children}</div>
      <Button asChild>
        <Link className="mx-auto mt-10 block w-fit text-base md:mx-0" href="/">
          <span>🐙</span>
          <span className="ml-2">トップページに戻る</span>
        </Link>
      </Button>
    </LandingLayout>
  );
}
