"use client";

import ErrorPage from "./_components/ErrorPage";

export default function GlobalError() {
  return (
    <html lang="ja">
      <body className="bg-primary-background text-primary-foreground">
        <ErrorPage title="Error">
          <p>サーバーでエラーが発生しました</p>
          <p>しばらく時間をおいて、再度お試しください 🙇</p>
        </ErrorPage>
      </body>
    </html>
  );
}
