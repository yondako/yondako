import ErrorPage from "@/components/ErrorPage";
import { generateMetadataTitle } from "@/lib/metadata";

export const metadata = generateMetadataTitle({
  pageTitle: "認証エラー",
  noindex: true,
});

export default async function AuthError() {
  return (
    <ErrorPage title="Error">
      <p>認証に失敗しました</p>
      <p>しばらく時間をおいて、再度お試しください 🙇</p>
    </ErrorPage>
  );
}
