import ErrorMessage from "@/components/ErrorMessage";

export default function OrientationError() {
  return (
    <div className="flex h-svh items-center">
      <ErrorMessage
        title="デバイスを縦にしてください"
        decoration={
          <span className="-left-1 absolute top-10 text-3xl">📱</span>
        }
        landscape
      >
        <p className="mt-1">この機能は現在、縦画面でのみ利用可能です 🙏</p>
      </ErrorMessage>
    </div>
  );
}
