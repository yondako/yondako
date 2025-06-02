"use client";

import { useSwipeable } from "react-swipeable";
import { useState } from "react"; // useEffect と useRef を削除
import type { ReactNode } from "react";
import { readingStatusOrder } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import { useRouter } from "next/navigation"; // useRouter をインポート

type Props = {
  children: ReactNode;
  currentStatus: ReadingStatus;
  // onSwipeEnd: (direction: "left" | "right") => void; // onSwipeEnd prop を削除
};

const SWIPE_ANIMATION_THRESHOLD = 50; // px
const DUMMY_PAGE_WIDTH = "80vw";

export function SwipeableTabView({ children, currentStatus }: Props) { // onSwipeEnd を props から削除
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showDummyPrev, setShowDummyPrev] = useState(false);
  const [showDummyNext, setShowDummyNext] = useState(false);
  const router = useRouter(); // useRouterフックを使用

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (!isSwiping) setIsSwiping(true);
      setTranslateX(eventData.deltaX);

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

      if (Math.abs(eventData.deltaX) > SWIPE_ANIMATION_THRESHOLD) {
        const currentIndex = readingStatusOrder.indexOf(currentStatus);
        if (eventData.dir === "Left") {
          if (currentIndex < readingStatusOrder.length - 1) {
            const nextStatus = readingStatusOrder[currentIndex + 1];
            router.push(`/library/${nextStatus}`); // router.push を直接呼び出す
          }
        } else if (eventData.dir === "Right") {
          if (currentIndex > 0) {
            const prevStatus = readingStatusOrder[currentIndex - 1];
            router.push(`/library/${prevStatus}`); // router.push を直接呼び出す
          }
        }
      }
      setTranslateX(0);
    },
    onSwipedAborted: () => {
      setIsSwiping(false);
      setShowDummyPrev(false);
      setShowDummyNext(false);
      setTranslateX(0);
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
    delta: 10,
  });

  const prevStatusIndex = readingStatusOrder.indexOf(currentStatus) - 1;
  const nextStatusIndex = readingStatusOrder.indexOf(currentStatus) + 1;

  const prevStatusLabel = prevStatusIndex >= 0 ? readingStatusOrder[prevStatusIndex] : null;
  const nextStatusLabel = nextStatusIndex < readingStatusOrder.length ? readingStatusOrder[nextStatusIndex] : null;


  return (
    <div {...handlers} style={{ touchAction: "pan-y" }} className="overflow-hidden">
      <div
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? "none" : "transform 0.3s ease-out",
          display: "flex",
          width: "100%",
        }}
      >
        {showDummyPrev && prevStatusLabel && (
          <div
            style={{
              minWidth: DUMMY_PAGE_WIDTH,
              flexShrink: 0,
              opacity: Math.max(0, translateX / SWIPE_ANIMATION_THRESHOLD - 1),
              transition: "opacity 0.2s ease-out",
            }}
            className="h-full min-h-[calc(100vh-200px)] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 border-r border-gray-300 dark:border-gray-600"
          >
            <p className="text-sm">{`〈 ${prevStatusLabel}`}</p>
          </div>
        )}

        <div style={{ minWidth: "100%", flexShrink: 0 }}>
          {children}
        </div>

        {showDummyNext && nextStatusLabel && (
          <div
            style={{
              minWidth: DUMMY_PAGE_WIDTH,
              flexShrink: 0,
              opacity: Math.max(0, -translateX / SWIPE_ANIMATION_THRESHOLD -1),
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
