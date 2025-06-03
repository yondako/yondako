"use client";

import IconBrandGitHub from "@/assets/icons/brand-github.svg";
import IconBrandGoogle from "@/assets/icons/brand-google.svg";
import Button from "@/components/Button";
import ExternalLink from "@/components/ExternalLink";
import { links } from "@/constants/site";
import { signIn } from "@/lib/auth-client";
import { type ComponentPropsWithoutRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import LoginLoading from "../LoginLoading";

type Props = {
  /** ログイン後のリダイレクト先 */
  redirectTo: string;
  className?: string;
};

/**
 * ログインボタンコンポーネント。Google認証とGitHub認証のボタンを提供し、クリック時にローディング状態を表示します。リダイレクト先URLを指定できます。
 */
export default function LoginButtons({ className, redirectTo }: Props) {
  const [loading, setLoading] = useState(false);

  const doLogin = async (provider: "google" | "github") => {
    setLoading(true);

    await signIn.social({
      provider,
      callbackURL: redirectTo,
    });
  };

  return (
    <>
      <LoginLoading show={loading} />
      <div className={twMerge("w-full", className)}>
        <div className="flex flex-col space-y-2">
          <LoginButton onClick={() => doLogin("google")}>
            <IconBrandGoogle className="h-[20px] w-[20px]" />
            <span className="text-sm">Googleで続ける</span>
          </LoginButton>
          <LoginButton value="github" onClick={() => doLogin("github")}>
            <IconBrandGitHub className="h-[20px] w-[20px]" />
            <span className="text-sm">GitHubで続ける</span>
          </LoginButton>
        </div>
        <p className="mt-4 break-keep text-xxs">
          アカウントを登録することにより、
          <wbr />
          <ExternalLink className="font-bold" href={links[2].href}>
            {links[2].title}
          </ExternalLink>
          <wbr />
          および
          <wbr />
          <ExternalLink className="font-bold" href={links[3].href}>
            {links[3].title}
          </ExternalLink>
          <wbr />
          に同意したものとみなされます。
        </p>
      </div>
    </>
  );
}

function LoginButton({
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "className" | "type" | "style">) {
  return (
    <Button
      {...props}
      className="flex items-center justify-center space-x-[10px] bg-white tracking-wider"
      type="button"
      style="accent"
    >
      {children}
    </Button>
  );
}
