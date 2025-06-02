import { readingStatusMetadata } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import { TabItem } from "./TabItem";
import { useSwipeable } from "react-swipeable"; // 追加
import { useRouter } from "next/navigation"; // 追加
import { useEffect, useState } from "react"; // 追加

const readingStatusOrder: ReadingStatus[] = [
  "want_read",
  "reading",
  "read",
] as const;

type Props = {
  current: ReadingStatus;
};

export default function Tab({ current }: Props) {
  const router = useRouter(); // 追加
  const [isTouchDevice, setIsTouchDevice] = useState(false); // 追加

  // 追加: クライアントサイドでのみ実行し、タッチデバイスか判定
  useEffect(() => {
    setIsTouchDevice(navigator.maxTouchPoints > 0);
  }, []);

  // 追加: スワイプイベントハンドラ
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isTouchDevice) return; // タッチデバイスでない場合は何もしない
      const currentIndex = readingStatusOrder.indexOf(current);
      if (currentIndex < readingStatusOrder.length - 1) {
        const nextStatus = readingStatusOrder[currentIndex + 1];
        router.push(`/library/${nextStatus}`);
      }
    },
    onSwipedRight: () => {
      if (!isTouchDevice) return; // タッチデバイスでない場合は何もしない
      const currentIndex = readingStatusOrder.indexOf(current);
      if (currentIndex > 0) {
        const prevStatus = readingStatusOrder[currentIndex - 1];
        router.push(`/library/${prevStatus}`);
      }
    },
    preventScrollOnSwipe: true, // スワイプ中のスクロールを防止
    trackMouse: false, // マウス操作でのスワイプは無効化 (タッチ操作のみ)
  });

  return (
    // スワイプイベントを適用するために div でラップし、handlers を付与
    <div {...handlers} className="mx-auto flex w-full rounded-full bg-tertiary-background lg:w-fit">
      {readingStatusOrder.map((status) => {
        const item = readingStatusMetadata.get(status);

        return item ? (
          <TabItem
            id={status}
            meta={item}
            current={status === current}
            key={status}
          />
        ) : null;
      })}
    </div>
  );
}
