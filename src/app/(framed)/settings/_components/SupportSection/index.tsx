import IconHelp from "@/assets/icons/help-filed.svg";
import { site } from "@/constants/site";
import FormLink from "./FormLink";

type Props = {
  userId: string;
};

export default function SupportSection({ userId }: Props) {
  const bugReportUrl = process.env.FORM_BUG_REPORT_URL;
  const bugReportUrlEntryKey = process.env.FORM_BUG_REPORT_URL_ENTRY_KEY;
  const contactUrl = process.env.FORM_CONTACT_URL;

  if (!bugReportUrl || !bugReportUrlEntryKey || !contactUrl) {
    return;
  }

  // ユーザーIDを入力済のバグ報告フォームのURLを生成
  const bugReportUrlWithUserId = new URL(bugReportUrl);
  bugReportUrlWithUserId.searchParams.append(bugReportUrlEntryKey, userId);

  // GitHubのIssue
  const issueUrl = new URL(site.github);
  issueUrl.pathname += "/issues";

  return (
    <section className="mt-10">
      <h2 className="flex items-center font-bold text-xl">
        <IconHelp className="mr-2 inline-block h-6 w-6" />
        <span>サポート</span>
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormLink
          title="バグ報告"
          description="サービスのバグや不具合を見つけた場合はこちら"
          href={bugReportUrlWithUserId.toString()}
        />
        <FormLink
          title="その他のお問い合わせ"
          description="その他、サービスへのお問い合わせはこちら"
          href={contactUrl}
        />
        <FormLink
          title="もしかして、開発者の方ですか？"
          description="GitHubでのIssue・PRをお待ちしております！"
          href={issueUrl.toString()}
        />
      </div>
    </section>
  );
}
