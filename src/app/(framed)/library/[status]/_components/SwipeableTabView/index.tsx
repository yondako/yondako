"use client";

import { readingStatusOrder } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import { animated, useSpring } from "@react-spring/web";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";
import { useSwipeable } from "react-swipeable";

type Props = PropsWithChildren<{
  currentStatus: ReadingStatus;
}>;

const SWIPE_ANIMATION_THRESHOLD = 32; // px
const SWIPE_TRANSITION_KEY = "swipeTransition";
const SWIPE_RESET_TIMEOUT = 300; // ms

export function SwipeableTabView({ children, currentStatus }: Props) {
  const router = useRouter();

  const windowWidthRef = useRef(0);
  const isSwipingRef = useRef(false);
  const isDialogOpenRef = useRef(false);
  const isSlideInAnimationCompletedRef = useRef(false);
  const currentIndexRef = useRef(readingStatusOrder.indexOf(currentStatus));
  const resetTimeoutRef = useRef<number | null>(null);

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

          isSlideInAnimationCompletedRef.current = true;
          return;
        }
      } catch {
        sessionStorage.removeItem(SWIPE_TRANSITION_KEY);
      }
    }

    // スライドインのアニメーションが再生済ならスキップ
    if (isSlideInAnimationCompletedRef.current) {
      return;
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // リサイズ検知
    windowWidthRef.current = window.innerWidth;

    const handleResize = () => {
      windowWidthRef.current = window.innerWidth;
    };

    window.addEventListener("resize", handleResize);

    // モーダル監視
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

    return () => {
      window.removeEventListener("resize", handleResize);

      observer.disconnect();

      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      // モーダルが開いている場合はスキップ
      if (isDialogOpenRef.current) {
        return;
      }

      isSwipingRef.current = true;

      // 既存のタイムアウトをクリア
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }

      // スワイプの稼動域を画面幅の1/3に制限
      const screenWidth = windowWidthRef.current || window.innerWidth;
      const maxSwipeDistance = screenWidth / 3;
      const clampedDeltaX = Math.max(-maxSwipeDistance, Math.min(maxSwipeDistance, eventData.deltaX));

      api.start({ x: clampedDeltaX });

      // スワイプ中にタイムアウトを設定
      resetTimeoutRef.current = window.setTimeout(() => {
        if (isSwipingRef.current) {
          isSwipingRef.current = false;

          api.start({
            x: 0,
            opacity: 1,
            config: { tension: 300, friction: 40 },
          });
        }
      }, SWIPE_RESET_TIMEOUT);
    },
    onSwiped: (eventData) => {
      // モーダルが開いている場合 or スワイプ中でない場合はスキップ
      if (isDialogOpenRef.current || !isSwipingRef.current) {
        return;
      }

      // タイムアウトをクリア
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }

      isSwipingRef.current = false;

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
          // NOTE: 1.0だとiPadでなぜか画面内に残るので1.8倍にしてる
          const exitDistance = eventData.dir === "Left" ? -screenWidth * 1.8 : screenWidth * 1.8;

          api.start({
            x: exitDistance,
            opacity: 0,
            config: {
              duration: 100,
              easing: (t) => t * t * t,
            },
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
        config: { tension: 300, friction: 40 },
      });
    },
    trackMouse: true,
    preventScrollOnSwipe: false,
    delta: 10,
  });

  return (
    <div {...handlers} style={{ touchAction: "pan-y" }} className="-mx-6 relative flex flex-1 overflow-hidden">
      <animated.div
        className="flex-1 px-6"
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
