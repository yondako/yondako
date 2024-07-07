import {
  ContinueWithGithub,
  ContinueWithGoogle,
} from "@/components/common/Icons";
import { BuiltInProviderType } from "@auth/core/providers";
import { signIn } from "@hono/auth-js/react";
import { ReactNode } from "react";

export default function LoginButton() {
  return (
    <div className="flex flex-col space-y-4 mt-12">
      <Button provider="google">
        <ContinueWithGoogle />
      </Button>
      <Button provider="github">
        <ContinueWithGithub />
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
      className="block w-[189px] mx-auto md:mx-0 h-[41px]"
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
