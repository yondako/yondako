"use client";

import { readingStatusOrder } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import { animated, useSpring } from "@react-spring/web";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useSwipeable } from "react-swipeable";

type Props = {
  children: ReactNode;
  currentStatus: ReadingStatus;
};

const SWIPE_ANIMATION_THRESHOLD = 50; // px

export function SwipeableTabView({ children, currentStatus }: Props) {
  const router = useRouter();

  const [isSwiping, setIsSwiping] = useState(false);
  const windowWidthRef = useRef(0);
  const isDialogOpenRef = useRef(false);
  const currentIndexRef = useRef(readingStatusOrder.indexOf(currentStatus));

  // react-springを使用したアニメーション
  const [springProps, api] = useSpring(() => ({
    x: 0,
    opacity: 1,
    config: { tension: 280, friction: 40 }, // キビキビとした動き
  }));

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

  // 初期化時に画面幅を確実に取得
  useEffect(() => {
    if (typeof window !== "undefined" && windowWidthRef.current === 0) {
      windowWidthRef.current = window.innerWidth;
    }
  });

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

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      // モーダルが開いている場合は無効
      if (isDialogOpenRef.current) {
        return;
      }

      if (!isSwiping) setIsSwiping(true);

      // スワイプの稼動域を画面幅の1/3に制限
      const screenWidth = windowWidthRef.current || window.innerWidth;
      const maxSwipeDistance = screenWidth / 3;
      const clampedDeltaX = Math.max(
        -maxSwipeDistance,
        Math.min(maxSwipeDistance, eventData.deltaX),
      );

      // リアルタイムでスプリングアニメーションを更新
      api.start({
        x: clampedDeltaX,
        immediate: true, // スワイプ中は即座に反映
      });
    },
    onSwiped: (eventData) => {
      // モーダルが開いている場合は無効
      if (isDialogOpenRef.current) {
        return;
      }

      setIsSwiping(false);

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
          // スワイプ方向に基づいてページを画面外に移動
          const screenWidth = windowWidthRef.current || window.innerWidth;
          const exitDistance =
            eventData.dir === "Left" ? -screenWidth : screenWidth;

          api.start({
            x: exitDistance,
            opacity: 0,
            config: { tension: 350, friction: 20, duration: 100 },
            onRest: () => {
              router.push(`/library/${targetStatus}`);
            },
          });

          return;
        }
      }

      // スワイプが不十分な場合は元の位置に戻る
      api.start({
        x: 0,
        config: { tension: 400, friction: 40 }, // 弾力のある戻りアニメーション
      });
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
    delta: 10,
  });

  return (
    <div
      {...handlers}
      style={{ touchAction: "pan-y" }}
      className="-mx-6 relative overflow-hidden"
    >
      {/* 現在のページ */}
      <animated.div
        className="w-full px-6"
        style={{
          transform: springProps.x.to((x) => `translateX(${x}px)`),
          opacity: springProps.opacity,
        }}
      >
        {children}
      </animated.div>
    </div>
  );
}
