import ErrorPage from "@/components/ErrorPage";
import { generateMetadataTitle } from "@/lib/metadata";

export const metadata = generateMetadataTitle({
  pageTitle: "NotFound",
  noindex: true,
});

export default function NotFound() {
  return (
    <ErrorPage title="NotFound">
      <p>ページが見つかりませんでした 🫥</p>
      <p>URLが間違っていないかご確認ください</p>
    </ErrorPage>
  );
}
