import Button from "@/components/common/Button";
import { signOut } from "@hono/auth-js/react";

export default function LogoutButton() {
  return (
    <Button
      className="block w-full mx-auto mt-10 text-base"
      onClick={() => {
        signOut({
          callbackUrl: "/",
        });
      }}
    >
      ログアウト
    </Button>
  );
}
