import Button from "@/components/common/Button";
import { signIn } from "@hono/auth-js/react";

export default function LoginButton() {
  return (
    <Button
      className="block w-full mx-auto mt-10 text-base"
      onClick={() =>
        signIn("github", {
          callbackUrl: "/library",
        })
      }
    >
      <span className="font-noto-emoji">🐙</span>
      <span className="ml-2">新規登録 or ログイン</span>
    </Button>
  );
}
