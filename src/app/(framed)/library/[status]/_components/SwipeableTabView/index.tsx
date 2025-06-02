"use client";

import { readingStatusOrder } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useSwipeable } from "react-swipeable";

type Props = {
  children: ReactNode;
  currentStatus: ReadingStatus;
};

const SWIPE_ANIMATION_THRESHOLD = 50; // px

export function SwipeableTabView({ children, currentStatus }: Props) {
  const router = useRouter();

  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showDummyPrev, setShowDummyPrev] = useState(false);
  const [showDummyNext, setShowDummyNext] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 画面幅を取得
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // role=dialogの存在を監視
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkDialogExists = () => {
      const dialogExists = document.querySelector('[role="dialog"]') !== null;
      setIsDialogOpen(dialogExists);
    };

    // 初期チェック
    checkDialogExists();

    // MutationObserverでDOMの変更を監視
    const observer = new MutationObserver(checkDialogExists);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["role"],
    });

    return () => observer.disconnect();
  }, []);

  // レスポンシブ対応のダミーページ幅を計算
  const getDummyPageOffset = () => {
    if (windowWidth >= 768) {
      // md breakpoint
      return 320; // 320px (w-80)
    }
    return windowWidth * 0.8; // 80vw
  };

  // ページ遷移完了時にフェードインを開始
  useEffect(() => {
    if (isNavigating) {
      setIsNavigating(false);
      setContentOpacity(0);

      const timer = setTimeout(() => {
        setContentOpacity(1);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (isDialogOpen) return; // ダイアログが開いている場合はスワイプを無効化

      if (!isSwiping) setIsSwiping(true);
      setTranslateX(eventData.deltaX);

      const currentIndex = readingStatusOrder.indexOf(currentStatus);
      if (
        eventData.deltaX < -SWIPE_ANIMATION_THRESHOLD &&
        currentIndex < readingStatusOrder.length - 1
      ) {
        setShowDummyNext(true);
        setShowDummyPrev(false);
      } else if (
        eventData.deltaX > SWIPE_ANIMATION_THRESHOLD &&
        currentIndex > 0
      ) {
        setShowDummyPrev(true);
        setShowDummyNext(false);
      } else {
        setShowDummyPrev(false);
        setShowDummyNext(false);
      }
    },
    onSwiped: (eventData) => {
      if (isDialogOpen) return; // ダイアログが開いている場合はスワイプを無効化

      setIsSwiping(false);
      setShowDummyPrev(false);
      setShowDummyNext(false);

      if (Math.abs(eventData.deltaX) > SWIPE_ANIMATION_THRESHOLD) {
        const currentIndex = readingStatusOrder.indexOf(currentStatus);
        let targetStatus: string | null = null;

        if (eventData.dir === "Left") {
          if (currentIndex < readingStatusOrder.length - 1) {
            targetStatus = readingStatusOrder[currentIndex + 1];
          }
        } else if (eventData.dir === "Right") {
          if (currentIndex > 0) {
            targetStatus = readingStatusOrder[currentIndex - 1];
          }
        }

        if (targetStatus) {
          setIsNavigating(true);
          setContentOpacity(0);

          setTimeout(() => {
            router.push(`/library/${targetStatus}`);
          }, 150);
        }
      }
      setTranslateX(0);
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
    delta: 10,
  });

  const prevStatusIndex = readingStatusOrder.indexOf(currentStatus) - 1;
  const nextStatusIndex = readingStatusOrder.indexOf(currentStatus) + 1;

  const prevStatusLabel =
    prevStatusIndex >= 0 ? readingStatusOrder[prevStatusIndex] : null;
  const nextStatusLabel =
    nextStatusIndex < readingStatusOrder.length
      ? readingStatusOrder[nextStatusIndex]
      : null;

  return (
    <div
      {...handlers}
      style={{ touchAction: "pan-y" }}
      className="relative overflow-hidden"
    >
      {/* 左ダミーページ */}
      {showDummyPrev && prevStatusLabel && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            opacity: Math.max(0, translateX / SWIPE_ANIMATION_THRESHOLD - 1),
            transition: "opacity 0.2s ease-out",
            transform: `translateX(${Math.min(0, translateX - getDummyPageOffset())}px)`,
            zIndex: 1,
          }}
          className="flex min-h-[calc(100vh-200px)] w-[80vw] items-center justify-center border-gray-300 border-r bg-gray-100 text-gray-400 md:w-80 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
        >
          <p className="text-sm">{`〈 ${prevStatusLabel}`}</p>
        </div>
      )}

      {/* 現在のページ */}
      <div
        className="w-full transition-opacity duration-300 ease-in-out"
        style={{
          opacity: contentOpacity,
          transform: `translateX(${translateX}px)`,
          transition: isSwiping
            ? "transform 0ms"
            : "transform 0.3s ease-out, opacity 0.3s ease-in-out",
        }}
      >
        {children}
      </div>

      {/* 右ダミーページ */}
      {showDummyNext && nextStatusLabel && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            opacity: Math.max(0, -translateX / SWIPE_ANIMATION_THRESHOLD - 1),
            transition: "opacity 0.2s ease-out",
            transform: `translateX(${Math.max(0, translateX + getDummyPageOffset())}px)`,
            zIndex: 1,
          }}
          className="flex min-h-[calc(100vh-200px)] w-[80vw] items-center justify-center border-gray-300 border-l bg-gray-100 text-gray-400 md:w-80 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
        >
          <p className="text-sm">{`${nextStatusLabel} 〉`}</p>
        </div>
      )}
    </div>
  );
}
