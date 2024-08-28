import ImageQrCode from "@/assets/images/qr-search-barcode.svg";
import ErrorMessage from "@/components/ErrorMessage";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default function MobileExclusive() {
  const isMobile = headers().get("X-IS-DESKTOP") === null;

  // モバイルであれば利用可能なのでリダイレクト
  if (isMobile) {
    redirect("/search/barcode");
  }

  return (
    <div className="flex h-full items-center">
      <ErrorMessage
        title="この機能はスマホからのみ利用可能です"
        decoration={
          <>
            <span className="absolute top-0 left-0 text-4xl">📱</span>
            <span className="-right-2 absolute bottom-7 text-3xl">💻️</span>
          </>
        }
      >
        <p className="mt-3">よかったらスマホからアクセスしてみてください 🙏</p>
        <p className="mt-1 text-xs">
          (需要があれば、デスクトップ対応するかもしれません)
        </p>
        <div className="mx-auto mt-12 w-48 rounded-2xl bg-tertiary-background p-4">
          <ImageQrCode className="text-accent" />
        </div>
      </ErrorMessage>
    </div>
  );
}
