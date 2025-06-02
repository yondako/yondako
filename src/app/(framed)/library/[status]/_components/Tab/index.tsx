"use client";

import { readingStatusMetadata } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import { TabItem } from "./TabItem";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";

const readingStatusOrder: ReadingStatus[] = [
  "want_read",
  "reading",
  "read",
] as const;

const SWIPE_THRESHOLD = 50; // px
const SWIPE_TIMEOUT = 500; // ms
// 縦スクロールと誤認させないための、X軸に対するY軸の移動許容率
// (例: Y移動量がX移動量の2.5倍未満なら横スワイプの可能性ありとする)
const SCROLL_RATIO_THRESHOLD = 2.5;

type Props = {
  current: ReadingStatus;
};

export default function Tab({ current }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // スワイプ状態管理用のref
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  // touchmove中のイベントリスナー重複防止用
  const processingTouchMoveRef = useRef(false);


  useEffect(() => {
    setIsTouchDevice(navigator.maxTouchPoints > 0);
  }, []);

  const handleSwiped = useCallback((direction: "left" | "right") => {
    // ライブラリページ以外、またはモーダル表示中(簡易判定)は処理しない
    if (!pathname.startsWith("/library/") || document.querySelector('[role="dialog"]')) {
      return;
    }

    const currentIndex = readingStatusOrder.indexOf(current);
    if (direction === "left") {
      if (currentIndex < readingStatusOrder.length - 1) {
        const nextStatus = readingStatusOrder[currentIndex + 1];
        router.push(`/library/${nextStatus}`);
      }
    } else if (direction === "right") {
      if (currentIndex > 0) {
        const prevStatus = readingStatusOrder[currentIndex - 1];
        router.push(`/library/${prevStatus}`);
      }
    }
  }, [pathname, current, router]);

  useEffect(() => {
    if (!isTouchDevice) return;

    const handleTouchStart = (event: TouchEvent) => {
      // マルチタッチや、すでに処理中の場合は無視
      if (event.touches.length !== 1 || processingTouchMoveRef.current) return;
      touchStartRef.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        time: Date.now(),
      };
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!touchStartRef.current || event.touches.length !== 1 || processingTouchMoveRef.current) {
        return;
      }

      processingTouchMoveRef.current = true; // 処理開始

      const touchCurrentX = event.touches[0].clientX;
      const touchCurrentY = event.touches[0].clientY;

      const deltaX = touchCurrentX - touchStartRef.current.x;
      const deltaY = touchCurrentY - touchStartRef.current.y;

      // Y軸の移動量がX軸の移動量より明らかに大きい場合は、縦スクロールとみなしスワイプ処理を中断
      if (Math.abs(deltaY) > Math.abs(deltaX) * SCROLL_RATIO_THRESHOLD) {
        touchStartRef.current = null; // スワイプ開始情報をリセット
      }

      processingTouchMoveRef.current = false; // 処理終了
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!touchStartRef.current || event.changedTouches.length !== 1) {
        return;
      }

      // event.preventDefault(); // ケースによっては必要になるが、今回は様子見

      const touchEndX = event.changedTouches[0].clientX;
      const swipeTime = Date.now() - touchStartRef.current.time;
      const deltaX = touchEndX - touchStartRef.current.x;
      // Y軸の移動量も考慮する (touchmoveでリセットされていなければ)
      const touchEndY = event.changedTouches[0].clientY;
      const deltaY = touchEndY - touchStartRef.current.y;


      if (swipeTime < SWIPE_TIMEOUT && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        // Y軸の移動がX軸の移動に対して大きすぎる場合はスワイプとみなさない
        if (Math.abs(deltaY) < Math.abs(deltaX) * SCROLL_RATIO_THRESHOLD) {
           if (deltaX < 0) {
            handleSwiped("left");
          } else {
            handleSwiped("right");
          }
        }
      }
      touchStartRef.current = null; // スワイプ開始情報をリセット
    };

    // document.body にリスナーを登録
    // passive: false は preventDefault を呼ぶ可能性がある場合に設定するが、
    // スクロールへの影響を最小限にするため、まずは様子見で未設定（デフォルトはtrueの場合が多い）
    // ただし、スワイプによる画面遷移を確実に行う場合、スクロールをキャンセルする必要が出てくる可能性がある
    document.body.addEventListener("touchstart", handleTouchStart);
    document.body.addEventListener("touchmove", handleTouchMove);
    document.body.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.body.removeEventListener("touchstart", handleTouchStart);
      document.body.removeEventListener("touchmove", handleTouchMove);
      document.body.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isTouchDevice, handleSwiped, pathname]); // pathnameも依存配列に追加 (モーダル判定のため)

  return (
    <div className="mx-auto flex w-full rounded-full bg-tertiary-background lg:w-fit">
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
