"use client";

import IconExclamationCircle from "@/assets/icons/exclamation-circle.svg";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { goodbyeUser } from "#actions/goodbyeUser";

export default function ConfirmInput() {
  const router = useRouter();
  const [result, dispatch] = useActionState(goodbyeUser, { success: false });

  useEffect(() => {
    if (result.success) {
      window.alert("👋 アカウントを削除しました");

      signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    }
  }, [result.success, router]);

  return (
    <form className="mt-6 text-sm" action={dispatch}>
      <Input className="lg:max-w-96" placeholder="アカウントを削除" name="phrase" />
      {result.error && (
        <p className="mt-2 flex items-center space-x-1 text-rose-700">
          <IconExclamationCircle className="h-4 w-4" />
          <span>{result.error}</span>
        </p>
      )}
      <Button className="mt-4 block w-full bg-rose-700 text-primary-background text-sm lg:w-fit" style="noBorder">
        👋 アカウントの削除を実行する
      </Button>
    </form>
  );
}
