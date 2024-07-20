"use client";

import Button from "@/components/Button";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <Button
      onClick={() => {
        signOut({ callbackUrl: "/" });
      }}
    >
      ログアウト
    </Button>
  );
}
