import IconContinueWithGithub from "@/assets/icons/continue-with-github.svg?react";
import IconContinueWithGoogle from "@/assets/icons/continue-with-google.svg?react";
import { BuiltInProviderType } from "@auth/core/providers";
import { signIn } from "@hono/auth-js/react";
import { ReactNode } from "react";

export default function LoginButton() {
  return (
    <div className="flex flex-col space-y-4 mt-12">
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
      className="block w-fit mx-auto md:mx-0"
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
