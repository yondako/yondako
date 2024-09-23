"use client";

import MessageTako from "@/components/MessageTako";

export default function NewsError() {
  return (
    <div className="flex h-full items-center">
      <MessageTako
        title="お知らせを取得できませんでした"
        decoration={<span className="-right-2 absolute top-2 text-5xl">🗞️</span>}
      >
        <p className="mt-4">しばらく時間をおいて、再度お試しください</p>
      </MessageTako>
    </div>
  );
}
