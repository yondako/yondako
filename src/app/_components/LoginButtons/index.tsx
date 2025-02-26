"use client";

import IconBrandGitHub from "@/assets/brands/brand-github.svg";
import IconBrandGoogle from "@/assets/brands/brand-google.svg";
import Button from "@/components/Button";
import ExternalLink from "@/components/ExternalLink";
import { links } from "@/constants/site";
import { authClient } from "@/lib/auth-client";
import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
// import { signInWithRedirect } from "#actions/signInWithRedirect";
import LoginLoading from "../LoginLoading";

type Props = {
  /** ログイン後のリダイレクト先 */
  redirectTo: string;
  className?: string;
};

export default function LoginButtons({ className, redirectTo }: Props) {
  // const handleSubmitWithRedirect = signInWithRedirect.bind(null, redirectTo);

  return (
    <div className={twMerge("w-full", className)}>
      <div className="flex flex-col space-y-2">
        <LoginLoading />
        <LoginButton value="google">
          <IconBrandGoogle className="h-[20px] w-[20px]" />
          <span className="text-sm">Googleで続ける</span>
        </LoginButton>
        <LoginButton
          value="github"
          onClick={async () => {
            const res = await authClient.signIn.social({
              provider: "github",
            });
            console.log("🔥️ signInWithRedirect", res);
          }}
        >
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
  );
}

function LoginButton({
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "className">) {
  return (
    <Button
      {...props}
      className="flex items-center justify-center space-x-[10px] bg-white tracking-wider"
      type="submit"
      name="provider"
    >
      {children}
    </Button>
  );
}
