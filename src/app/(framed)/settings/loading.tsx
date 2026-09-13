import IconHelp from "@/assets/icons/help-filed.svg";
import IconUserFiled from "@/assets/icons/user-filed.svg";
import Footer from "@/components/Footer";
import SettingProperty from "./_components/SettingProperty";

export default function Loading() {
  return (
    <div>
      <output className="sr-only">設定を読み込み中</output>
      <section aria-hidden="true">
        <h2 className="flex items-center font-bold text-lg md:text-xl">
          <IconUserFiled className="mr-2 inline-block h-6 w-6" />
          <span>アカウント</span>
        </h2>
        <div className="mt-6 w-full space-y-6 rounded-2xl bg-tertiary-background p-8">
          <SettingProperty title="ユーザーID" description="サポート時などに使用します">
            <div className="h-5 w-48 max-w-full animate-pulse rounded bg-primary-foreground/20" />
          </SettingProperty>
          <SettingProperty title="ログアウト" description="このデバイスからログアウトして、トップページに戻ります">
            <div className="h-9 w-full shrink-0 animate-pulse rounded-full bg-primary-foreground/20 sm:w-48" />
          </SettingProperty>
          <SettingProperty title="退会" description="アカウントを削除して退会します">
            <div className="h-9 w-full shrink-0 animate-pulse rounded-full bg-primary-foreground/20 sm:w-48" />
          </SettingProperty>
        </div>
      </section>
      {process.env.FORM_BUG_REPORT_URL && process.env.FORM_CONTACT_URL && (
        <section className="mt-10" aria-hidden="true">
          <h2 className="flex items-center font-bold text-lg md:text-xl">
            <IconHelp className="mr-2 inline-block h-6 w-6" />
            <span>サポート</span>
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index.toString()} className="animate-pulse space-y-2 rounded-2xl bg-tertiary-background p-8">
                <div className="h-5 w-1/2 rounded bg-primary-foreground/20" />
                <div className="h-4 w-full rounded bg-secondary-foreground/20" />
              </div>
            ))}
          </div>
        </section>
      )}
      <Footer className="mt-8 text-center lg:hidden" />
    </div>
  );
}
