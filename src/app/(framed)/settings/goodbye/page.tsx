import { auth } from "@/lib/auth";
import { createSignInPath } from "@/lib/path";
import { redirect } from "next/navigation";
import ConfirmInput from "./_components/ConformInput";

export const runtime = "edge";

export default async function Goodbye() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/settings/goodbye"));
  }

  return (
    <div className="mx-auto max-w-lg lg:mx-0">
      <h2 className="font-bold text-2xl">アカウントの削除</h2>

      <div className="mt-4 text-sm">
        <p>
          アカウント情報や今までの読書記録など、すべてのデータが削除されます
        </p>
        <p>この操作は取り消すことができません</p>
        <p className="mt-4">
          確認のため、「アカウントを削除」と入力してください
        </p>
      </div>

      <ConfirmInput />
    </div>
  );
}
