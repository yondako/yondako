"use client";

import { useRouter } from "next/navigation";
import IconLogout from "@/assets/icons/logout.svg";
import Button from "@/components/Button";
import { signOut } from "@/lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();

  const handleClickLogout = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <Button
      className="flex w-full items-center justify-center space-x-2 text-sm sm:w-48"
      type="button"
      style="accent"
      onClick={handleClickLogout}
    >
      <IconLogout className="h-5 w-5" />
      <span>ログアウト</span>
    </Button>
  );
}
