import type { Metadata } from "next";
import ErrorPage from "./_components/ErrorPage";

export const metadata: Metadata = {
  title: "NotFound | yondako",
};

export default function NotFound() {
  return (
    <ErrorPage title="NotFound">
      <p>ページが見つかりませんでした 🫥</p>
      <p>URLが間違っていないかご確認ください</p>
    </ErrorPage>
  );
}
