"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import IconExclamationCircle from "#src/assets/icons/exclamation-circle.svg";
import Button from "#src/components/Button/index";
import Input from "#src/components/Input/index";
import { goodbyeUser } from "../../_actions/goodbye";

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
        className="lg:max-w-96"
        placeholder="アカウントを削除"
        name="phrase"
      />
      {result.error && (
        <p className="mt-2 flex items-center space-x-1 text-rose-700">
          <IconExclamationCircle className="h-4 w-4" />
          <span>{result.error}</span>
        </p>
      )}
      <Button className="mt-4 block w-full border-0 bg-rose-700 text-primary-background text-sm lg:w-fit">
        👋 アカウントの削除を実行する
      </Button>
    </form>
  );
}
