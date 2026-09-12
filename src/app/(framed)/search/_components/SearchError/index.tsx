"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Button from "@/components/Button";
import MessageTako from "@/components/MessageTako";
import { SearchLoading } from "../SearchFeedback";

export default function SearchError() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (pending) return <SearchLoading />;

  return (
    <MessageTako
      className="mt-16"
      title="検索できませんでした"
      decoration={<span className="-right-2 absolute top-0 text-5xl">🔧</span>}
    >
      <p className="mt-3">一時的に検索が利用できないようです。</p>
      <p>時間をおいて、再度お試しください。</p>
      <Button
        className="mt-6"
        type="button"
        onClick={() => {
          startTransition(() => router.refresh());
        }}
      >
        再検索する
      </Button>
    </MessageTako>
  );
}
