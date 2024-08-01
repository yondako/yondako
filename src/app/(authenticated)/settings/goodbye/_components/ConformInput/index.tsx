"use client";

import { goodbyeUser } from "../../_actions/goodbye";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useFormState } from "react-dom";
import IconExclamationCircle from "@/assets/icons/exclamation-circle.svg";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function ConfirmInput() {
  const [result, dispatch] = useFormState(goodbyeUser, { success: false });

  useEffect(() => {
    if (result.success) {
      window.alert("👋 アカウントを削除しました");
      signOut({ callbackUrl: "/" });
    }
  }, [result.success]);

  return (
    <form className="mt-6 text-sm" action={dispatch}>
      <Input
        className="max-w-96 px-5 py-3"
        placeholder="アカウントを削除"
        name="phrase"
      />
      {result.error && (
        <p className="mt-2 flex items-center space-x-1 text-rose-700">
          <IconExclamationCircle className="h-4 w-4" />
          <span>{result.error}</span>
        </p>
      )}
      <Button className="mt-4 block w-full border-0 bg-rose-700 text-background text-sm md:w-fit">
        👋 アカウントの削除を実行する
      </Button>
    </form>
  );
}
