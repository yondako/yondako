"use client";

import { readingStatusOrder } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { useSwipeable } from "react-swipeable";

type Props = {
  children: ReactNode;
  currentStatus: ReadingStatus;
};

const SWIPE_ANIMATION_THRESHOLD = 50; // px
const DUMMY_PAGE_WIDTH = "80vw";

export function SwipeableTabView({ children, currentStatus }: Props) {
  const router = useRouter();

  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showDummyPrev, setShowDummyPrev] = useState(false);
  const [showDummyNext, setShowDummyNext] = useState(false);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
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
      className="overflow-hidden"
    >
      <div
        className="flex"
        style={{
          transform: `translateX(calc(${translateX}px + ${showDummyPrev ? -80 : 0}vw))`,
          transition: isSwiping ? "none" : "transform 0.3s ease-out",
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
            className="flex h-full min-h-[calc(100vh-200px)] items-center justify-center border-gray-300 border-r bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
          >
            <p className="text-sm">{`〈 ${prevStatusLabel}`}</p>
          </div>
        )}

        <div className="w-full shrink-0">{children}</div>

        {showDummyNext && nextStatusLabel && (
          <div
            style={{
              minWidth: DUMMY_PAGE_WIDTH,
              flexShrink: 0,
              opacity: Math.max(0, -translateX / SWIPE_ANIMATION_THRESHOLD - 1),
              transition: "opacity 0.2s ease-out",
            }}
            className="flex h-full min-h-[calc(100vh-200px)] items-center justify-center border-gray-300 border-l bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
          >
            <p className="text-sm">{`${nextStatusLabel} 〉`}</p>
          </div>
        )}
      </div>
    </div>
  );
}
