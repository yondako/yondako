import IconContinueWithGoogle from "@/assets/icons/continue-with-google.svg?react";
import IconContinueWithGithub from "@/assets/icons/continue-with-github.svg?react";
import { signIn } from "@hono/auth-js/react";
import { ReactNode } from "react";
import { BuiltInProviderType } from "@auth/core/providers";

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
  provider: BuiltInProviderType
  children: ReactNode
}

function Button({ provider, children }: ButtonProps) {
  return (
      <button
        onClick={() =>
          signIn(provider, {
            callbackUrl: "/library",
          })
        }
      >
        {children}
      </button>
  )
}
