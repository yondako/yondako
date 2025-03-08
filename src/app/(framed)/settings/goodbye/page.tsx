import { PATH_SETTING_GOODBYE } from "@/constants/path";
import { getAuth } from "@/lib/auth";
import { createSignInPath } from "@/lib/path";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ConfirmInput from "./_components/ConformInput";

export default async function Goodbye() {
  const { env } = await getCloudflareContext({
    async: true,
  });

  const auth = getAuth(env.DB);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect(createSignInPath(PATH_SETTING_GOODBYE));
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
