import IconUserFiled from "@/assets/icons/user-filed.svg";
import Button from "@/components/Button";
import Link from "next/link";
import LogoutButton from "../LogoutButton";
import SettingProperty from "../SettingProperty";

type Props = {
  userId: string;
};

export default function AccountSection({ userId }: Props) {
  return (
    <section>
      <h2 className="flex items-center font-bold text-lg md:text-xl">
        <IconUserFiled className="mr-2 inline-block h-6 w-6" />
        <span>アカウント</span>
      </h2>
      <div className="mt-6 w-full space-y-6 rounded-2xl bg-tertiary-background p-8">
        <SettingProperty
          title="ユーザーID"
          description="サポート時などに使用します"
        >
          <p className="break-all text-primary-foreground text-sm">{userId}</p>
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
    </section>
  );
}
