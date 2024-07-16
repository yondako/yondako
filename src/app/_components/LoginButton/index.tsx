"use client";

import IconContinueWithGithub from "@/assets/icons/continue-with-github.svg";
import IconContinueWithGoogle from "@/assets/icons/continue-with-google.svg";
import type { BuiltInProviderType } from "next-auth/providers";
import { signIn } from "next-auth/react";
import type { ReactNode } from "react";

export default function LoginButton() {
  return (
    <div className="mt-12 flex flex-col space-y-4">
      <Button provider="google">
        <IconContinueWithGoogle />
      </Button>
      <Button provider="github">
        <IconContinueWithGithub />
      </Button>
    </div>
  );
}

type ButtonProps = {
  provider: BuiltInProviderType;
  children: ReactNode;
};

function Button({ provider, children }: ButtonProps) {
  return (
    <button
      className="mx-auto block h-[41px] w-[189px] md:mx-0"
      onClick={() =>
        signIn(provider, {
          callbackUrl: "/library/reading",
        })
      }
    >
      {children}
    </button>
  );
}
