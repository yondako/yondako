import IconClose from "@/assets/icons/x.svg";
import * as Dialog from "@radix-ui/react-dialog";
import {
  type AnimationResult,
  animated,
  useTransition,
} from "@react-spring/web";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { AdaptiveModalDrawerProps } from "./props";

/**
 * デスクトップ環境でモーダルダイアログとして表示される適応型コンポーネント。画面の中央にオーバーレイとして表示され、背景をクリックして閉じることができます。
 */
export default function Modal({
  open = false,
  onOpenChange,
  onAnimationEnd,
  contentClassName,
  triggerChildren,
  children,
}: AdaptiveModalDrawerProps) {
  const [isOpen, setIsOpen] = useState(open);
  const ref = useRef<HTMLButtonElement>(null);

  const handleDialogChange = (state: boolean) => {
    if (onOpenChange) {
      onOpenChange(state);
    }

    setIsOpen(state);
  };

  const transitions = useTransition(isOpen, {
    from: () => {
      const rect = ref.current?.getBoundingClientRect();

      // トリガー要素の中央座標を%で算出
      const top = rect?.top
        ? `${((rect.top + rect.height * 0.5) / window.innerHeight) * 100}%`
        : "50%";

      const left = rect?.left
        ? `${((rect.left + rect.width * 0.5) / window.innerWidth) * 100}%`
        : "50%";

      return {
        scale: 0.25,
        opacity: 0,
        filter: "blur(8px)",
        top,
        left,
      };
    },
    enter: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      top: "50%",
      left: "50%",
      config: {
        mass: 1.1, // 少しバウンドさせる
        tension: 250,
        friction: 28,
      },
    },
    leave: {
      scale: 1.025,
      opacity: 0,
      filter: "blur(16px)",
      config: {
        mass: 0.8,
        tension: 200,
        friction: 26,
      },
      onRest: (result: AnimationResult) => {
        // アニメーションの再生が終了した
        if (result.finished && onAnimationEnd) {
          onAnimationEnd(isOpen);
        }
      },
    },
  });

  const Overlay = animated(Dialog.Overlay);
  const Content = animated(Dialog.Content);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleDialogChange}>
      {triggerChildren && (
        <Dialog.Trigger asChild ref={ref}>
          {triggerChildren}
        </Dialog.Trigger>
      )}
      <Dialog.Portal forceMount>
        {transitions(
          (style, isOpen) =>
            isOpen && (
              <>
                <Overlay
                  className="fixed inset-0 bg-black/40"
                  style={{ opacity: style.opacity }}
                />
                <Content
                  className={twMerge(
                    "fixed flex items-center rounded-2xl bg-primary-background p-10",
                    contentClassName,
                  )}
                  style={{
                    ...style,
                    transformOrigin: "top left",
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                >
                  <Dialog.Close
                    className={
                      "absolute top-4 right-4 cursor-pointer rounded bg-primary-background p-1 text-secondary-foreground transition hover:brightness-95"
                    }
                    data-testid="button-close"
                  >
                    <IconClose className="h-4 w-4" />
                  </Dialog.Close>
                  {children?.({
                    Title: Dialog.Title,
                    Description: Dialog.Description,
                    Close: Dialog.Close,
                  })}
                </Content>
              </>
            ),
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
