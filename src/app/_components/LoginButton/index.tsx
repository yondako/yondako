import IconBrandGitHub from "@/assets/icons/brand-github.svg";
import IconBrandGoogle from "@/assets/icons/brand-google.svg";
import Button from "@/components/Button";
import ExternalLink from "@/components/ExternalLink";
import { links } from "@/constants/site";
import { signIn } from "@/lib/auth";
import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
};

export default function LoginButtons({ className }: Props) {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    const provider = formData.get("provider") as string;

    await signIn(provider, { redirectTo: "/library/want_read" });
  };

  return (
    <div className={twMerge("w-full", className)}>
      <form className="flex flex-col space-y-2" action={handleSubmit}>
        <LoginButton value="google">
          <IconBrandGoogle className="h-[20px] w-[20px]" />
          <span className="text-sm">Googleで続ける</span>
        </LoginButton>
        <LoginButton value="github">
          <IconBrandGitHub className="h-[20px] w-[20px]" />
          <span className="text-sm">GitHubで続ける</span>
        </LoginButton>
      </form>
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
