import Button from "@/components/Button";
import Footer from "@/components/Footer";
import { auth } from "@/lib/auth";
import { generateMetadataTitle } from "@/lib/metadata";
import { createSignInPath } from "@/lib/path";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "./_components/LogoutButton";
import SettingProperty from "./_components/SettingProperty";

export const runtime = "edge";

export const metadata = generateMetadataTitle("設定");

export default async function Settings() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(createSignInPath("/settings"));
  }

  return (
    <>
      <h2 className="font-bold text-xl">アカウント</h2>
      <div className="mt-4 w-full space-y-4 rounded-2xl bg-tertiary-background p-8">
        <SettingProperty
          title="ユーザーID"
          description="サポート時などに使用します"
        >
          <p className="break-all text-primary-foreground text-sm">
            {session.user.id}
          </p>
        </SettingProperty>

        <SettingProperty
          title="ログアウト"
          description="このデバイスからログアウトして、トップページに戻ります"
        >
          <LogoutButton />
        </SettingProperty>

        <SettingProperty
          title="退会"
          description="アカウントを削除して退会します"
        >
          <Button
            className="block w-full border-0 bg-rose-700 text-primary-background text-sm sm:w-48"
            asChild
          >
            <Link href="/settings/goodbye">アカウントを削除</Link>
          </Button>
        </SettingProperty>
      </div>
      <Footer className="mt-8 text-center lg:hidden" />
    </>
  );
}
