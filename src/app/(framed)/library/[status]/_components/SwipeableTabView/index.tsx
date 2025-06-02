"use client";

import { useSwipeable } from "react-swipeable";
import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { readingStatusOrder } from "@/constants/status"; // readingStatusOrder をインポート
import type { ReadingStatus } from "@/types/readingStatus";

type Props = {
  children: ReactNode;
  currentStatus: ReadingStatus;
  onSwipeEnd: (direction: "left" | "right") => void;
};

const SWIPE_ANIMATION_THRESHOLD = 50; // px
const DUMMY_PAGE_WIDTH = "80vw"; // ダミーページの幅（隣のページが少し見える程度）

export function SwipeableTabView({ children, currentStatus, onSwipeEnd }: Props) {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showDummyPrev, setShowDummyPrev] = useState(false);
  const [showDummyNext, setShowDummyNext] = useState(false);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (!isSwiping) setIsSwiping(true);
      // 縦スクロールの抑制は react-swipeable の preventScrollOnSwipe: true を使うことを検討
      // ただし、ページ全体のスクロールとの兼ね合いで調整が必要な場合がある

      // 左スワイプ（次へ）の場合、deltaX は負の値
      // 右スワイプ（前へ）の場合、deltaX は正の値
      setTranslateX(eventData.deltaX);

      // 隣のページが見えるようにダミー表示を制御
      const currentIndex = readingStatusOrder.indexOf(currentStatus);
      if (eventData.deltaX < -SWIPE_ANIMATION_THRESHOLD && currentIndex < readingStatusOrder.length - 1) {
        setShowDummyNext(true);
        setShowDummyPrev(false);
      } else if (eventData.deltaX > SWIPE_ANIMATION_THRESHOLD && currentIndex > 0) {
        setShowDummyPrev(true);
        setShowDummyNext(false);
      } else {
        setShowDummyPrev(false);
        setShowDummyNext(false);
      }
    },
    onSwiped: (eventData) => {
      setIsSwiping(false);
      setShowDummyPrev(false);
      setShowDummyNext(false);

      // 閾値を超えたらページ遷移
      if (Math.abs(eventData.deltaX) > SWIPE_ANIMATION_THRESHOLD) {
        if (eventData.dir === "Left") {
          onSwipeEnd("left");
        } else if (eventData.dir === "Right") {
          onSwipeEnd("right");
        }
      }
      // スワイプ終了後は元の位置に戻す
      setTranslateX(0);
    },
    onSwipedAborted: () => {
      setIsSwiping(false);
      setShowDummyPrev(false);
      setShowDummyNext(false);
      setTranslateX(0); // 中断された場合も元の位置に戻す
    },
    trackMouse: true, // マウス操作でもスワイプを可能にするか（開発中は便利）
    preventScrollOnSwipe: true, // スワイプ中の縦スクロールを防止
    delta: 10, // スワイプ検知の最小移動量(px)
  });

  const prevStatusIndex = readingStatusOrder.indexOf(currentStatus) - 1;
  const nextStatusIndex = readingStatusOrder.indexOf(currentStatus) + 1;

  const prevStatusLabel = prevStatusIndex >= 0 ? readingStatusOrder[prevStatusIndex] : null;
  const nextStatusLabel = nextStatusIndex < readingStatusOrder.length ? readingStatusOrder[nextStatusIndex] : null;


  return (
    <div {...handlers} style={{ touchAction: "pan-y" }} className="overflow-hidden"> {/* touchAction: pan-y で縦スクロールを許可しつつ、react-swipeableで横スワイプを制御 */}
      <div
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? "none" : "transform 0.3s ease-out",
          display: "flex",
          width: "100%", // スワイプ対象のコンテンツ幅
        }}
      >
        {/* 前のページのダミー */}
        {showDummyPrev && prevStatusLabel && (
          <div
            style={{
              minWidth: DUMMY_PAGE_WIDTH,
              flexShrink: 0,
              // transform: `translateX(-100%)`, // 左に配置
              opacity: Math.max(0, translateX / SWIPE_ANIMATION_THRESHOLD - 1), // スワイプ量に応じて表示
              transition: "opacity 0.2s ease-out",
            }}
            className="h-full min-h-[calc(100vh-200px)] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 border-r border-gray-300 dark:border-gray-600"
          >
            <p className="text-sm">{`〈 ${prevStatusLabel}`}</p>
          </div>
        )}

        {/* 現在のページコンテンツ */}
        <div style={{ minWidth: "100%", flexShrink: 0 }}>
          {children}
        </div>

        {/* 次のページのダミー */}
        {showDummyNext && nextStatusLabel && (
          <div
            style={{
              minWidth: DUMMY_PAGE_WIDTH,
              flexShrink: 0,
              // transform: `translateX(100%)`, // 右に配置
              opacity: Math.max(0, -translateX / SWIPE_ANIMATION_THRESHOLD -1), // スワイプ量に応じて表示
              transition: "opacity 0.2s ease-out",
            }}
            className="h-full min-h-[calc(100vh-200px)] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 border-l border-gray-300 dark:border-gray-600"
          >
            <p className="text-sm">{`${nextStatusLabel} 〉`}</p>
          </div>
        )}
      </div>
    </div>
  );
}
