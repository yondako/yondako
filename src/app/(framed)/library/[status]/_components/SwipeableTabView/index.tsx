"use client";

import { readingStatusOrder } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import { animated, useSpring } from "@react-spring/web";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { PropsWithChildren } from "react";
import { useSwipeable } from "react-swipeable";

type Props = PropsWithChildren<{
  currentStatus: ReadingStatus;
}>;

const SWIPE_ANIMATION_THRESHOLD = 32; // px
const SWIPE_TRANSITION_KEY = "swipeTransition";

export function SwipeableTabView({ children, currentStatus }: Props) {
  const router = useRouter();

  const [isSwiping, setIsSwiping] = useState(false);
  const windowWidthRef = useRef(0);
  const isDialogOpenRef = useRef(false);
  const currentIndexRef = useRef(readingStatusOrder.indexOf(currentStatus));

  const [springProps, api] = useSpring(() => ({
    x: 0,
    opacity: 0,
  }));

  // スワイプ遷移の検出と初期アニメーション
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const swipeData = sessionStorage.getItem(SWIPE_TRANSITION_KEY);
    if (swipeData) {
      try {
        const { direction, targetStatus } = JSON.parse(swipeData);

        // 現在のページが遷移先と一致する場合のみスライドイン
        if (targetStatus === currentStatus) {
          const screenWidth = window.innerWidth;
          const initialX = direction === "Left" ? screenWidth * 0.2 : -screenWidth * 0.2;

          // 初期位置を設定
          api.set({ x: initialX, opacity: 0 });

          // 一度使用したら削除
          sessionStorage.removeItem(SWIPE_TRANSITION_KEY);

          requestAnimationFrame(() => {
            api.start({
              x: 0,
              opacity: 1,
              config: { tension: 300, friction: 30 },
            });
          });
          return;
        }
      } catch {
        sessionStorage.removeItem(SWIPE_TRANSITION_KEY);
      }
    }

    api.start({
      x: 0,
      opacity: 1,
      config: {
        tension: 100,
        friction: 30,
        easing: (t) => t * t * t,
      },
    });
  }, [currentStatus, api]);

  // 現在のステータスのインデックスを更新
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

  const handlers = useSwipeable({
    onSwipeStart: () => {
      console.log("Swipe started");
    },
    onSwiping: (eventData) => {
      // モーダルが開いている場合は無効
      if (isDialogOpenRef.current) {
        return;
      }

      if (!isSwiping) {
        setIsSwiping(true);
      }

      console.log("Swiping", eventData);

      // スワイプの稼動域を画面幅の1/3に制限
      const screenWidth = windowWidthRef.current || window.innerWidth;
      const maxSwipeDistance = screenWidth / 3;
      const clampedDeltaX = Math.max(-maxSwipeDistance, Math.min(maxSwipeDistance, eventData.deltaX));

      api.start({
        x: clampedDeltaX,
        config: { tension: 200, friction: 50 },
      });
    },
    onSwiped: (eventData) => {
      // モーダルが開いている場合は無効
      if (isDialogOpenRef.current) {
        return;
      }

      console.log("Swiped", eventData);

      setIsSwiping(false);

      if (Math.abs(eventData.deltaX) > SWIPE_ANIMATION_THRESHOLD) {
        const currentIndex = currentIndexRef.current;
        let targetStatus: ReadingStatus | null = null;

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
          // スワイプ情報をsessionStorageに保存
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              SWIPE_TRANSITION_KEY,
              JSON.stringify({
                direction: eventData.dir,
                targetStatus,
              }),
            );
          }

          // スワイプ方向に基づいてページを画面外に移動
          const screenWidth = windowWidthRef.current || window.innerWidth;
          const exitDistance = eventData.dir === "Left" ? -screenWidth * 0.8 : screenWidth * 0.8;

          api.start({
            x: exitDistance,
            opacity: 0,
            config: { duration: 200, easing: (t) => t * (2 - t) },
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
        opacity: 1,
        config: { tension: 400, friction: 40 },
      });
    },
    trackMouse: true,
    preventScrollOnSwipe: false,
    delta: 10,
  });

  return (
    <div {...handlers} style={{ touchAction: "pan-y" }} className="-mx-6 relative overflow-hidden">
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
