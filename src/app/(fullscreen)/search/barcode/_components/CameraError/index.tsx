import ErrorMessage from "@/components/ErrorMessage";
import MobileHeader from "@/components/MobileHeader";

export default function CameraError() {
  return (
    <div className="flex h-svh items-center px-6">
      <MobileHeader className="fixed inset-0 z-10 h-fit text-accent" />
      <ErrorMessage
        title="外カメラが起動できませんでした"
        decoration={
          <>
            <span className="absolute top-0 left-0 text-2xl">📷️</span>
            <span className="-right-8 absolute top-0 text-5xl">❓️</span>
          </>
        }
      >
        <p className="mx-4 mt-3">この機能では外カメラを使用します</p>
        <p className="mx-4 mt-1">
          外カメラがお使いのデバイスにある場合は、ブラウザで使用を許可しているか設定をご確認ください
        </p>
      </ErrorMessage>
    </div>
  );
}
