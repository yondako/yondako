"use client";

import BookListSkeleton from "@/components/BookList/Skeleton";
import { readingStatusOrder } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const windowWidthRef = useRef(0);
  const isDialogOpenRef = useRef(false);
  const currentIndexRef = useRef(readingStatusOrder.indexOf(currentStatus));

  useEffect(() => {
    currentIndexRef.current = readingStatusOrder.indexOf(currentStatus);
  }, [currentStatus]);

  // 画面幅を取得
  useEffect(() => {
    if (typeof window !== "undefined") {
      windowWidthRef.current = window.innerWidth;

      const handleResize = () => {
        windowWidthRef.current = window.innerWidth;
      };

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // スワイプを無効化するためにモーダルの存在を監視
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const checkDialogExists = () => {
      const dialogExists = document.querySelector('[role="dialog"]') !== null;
      isDialogOpenRef.current = dialogExists;
    };

    checkDialogExists();

    const observer = new MutationObserver(checkDialogExists);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["role"],
    });

    return () => observer.disconnect();
  }, []);

  // ダミーページ幅を計算
  const getDummyPageOffset = useCallback(() => {
    if (windowWidthRef.current >= 768) {
      // md breakpoint
      return 320; // 320px (w-80)
    }

    return windowWidthRef.current * 0.8; // 80vw
  }, []);

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
      // モーダルが開いている場合は無効
      if (isDialogOpenRef.current) {
        return;
      }

      if (!isSwiping) setIsSwiping(true);
      setTranslateX(eventData.deltaX);

      const currentIndex = currentIndexRef.current;

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
      // モーダルが開いている場合は無効
      if (isDialogOpenRef.current) {
        return;
      }

      setIsSwiping(false);
      setShowDummyPrev(false);
      setShowDummyNext(false);

      if (Math.abs(eventData.deltaX) > SWIPE_ANIMATION_THRESHOLD) {
        const currentIndex = currentIndexRef.current;
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

  const { prevStatusLabel, nextStatusLabel } = useMemo(() => {
    const currentIndex = readingStatusOrder.indexOf(currentStatus);
    const prevStatusIndex = currentIndex - 1;
    const nextStatusIndex = currentIndex + 1;

    return {
      prevStatusLabel:
        prevStatusIndex >= 0 ? readingStatusOrder[prevStatusIndex] : null,
      nextStatusLabel:
        nextStatusIndex < readingStatusOrder.length
          ? readingStatusOrder[nextStatusIndex]
          : null,
    };
  }, [currentStatus]);

  return (
    <div
      {...handlers}
      style={{ touchAction: "pan-y" }}
      className="-mx-6 lg:-mx-12 relative overflow-hidden"
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
          className="w-[80vw] border-gray-300 border-r bg-background md:w-80 dark:border-gray-600"
        >
          <div className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                〈 {prevStatusLabel}
              </span>
            </div>
            <BookListSkeleton count={3} />
          </div>
        </div>
      )}

      {/* 現在のページ */}
      <div
        className="w-full px-6 transition-opacity duration-300 ease-in-out lg:px-12"
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
          className="w-[80vw] border-gray-300 border-l bg-background md:w-80 dark:border-gray-600"
        >
          <div className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                {nextStatusLabel} 〉
              </span>
            </div>
            <BookListSkeleton count={3} />
          </div>
        </div>
      )}
    </div>
  );
}
