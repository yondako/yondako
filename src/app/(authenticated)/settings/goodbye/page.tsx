"use client";

import ConfirmInput from "./_components/ConformInput";

export const runtime = "edge";

export default function Goodbye() {
  return (
    <>
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
    </>
  );
}
