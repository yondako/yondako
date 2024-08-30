import IconClose from "@/assets/icons/x.svg";
import * as Dialog from "@radix-ui/react-dialog";
import { animated, useTransition } from "@react-spring/web";
import { useRef, useState } from "react";
import { BookThumbnail } from "../BookThumbnail";
import BookDetailContent from "./Content";
import type { BookDetailProps } from "./props";

export default function BookDetailDialog({
  bookDetailProps,
  children,
}: BookDetailProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleDialogChange = (isOpen: boolean) => setIsOpen(isOpen);

  const transitions = useTransition(isOpen, {
    from: () => {
      const rect = ref.current?.getBoundingClientRect();

      // 書籍カードの中央座標を%で算出
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
    },
  });

  const Overlay = animated(Dialog.Overlay);
  const Content = animated(Dialog.Content);

  const { data } = bookDetailProps;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleDialogChange}>
      {children && (
        <Dialog.Trigger asChild ref={ref}>
          {children}
        </Dialog.Trigger>
      )}
      <Dialog.Portal forceMount>
        {transitions((style, isOpen) => (
          <>
            {isOpen && (
              <Overlay
                className="fixed inset-0 bg-black/40"
                style={{ opacity: style.opacity }}
              />
            )}
            {isOpen && (
              <Content
                className="fixed flex min-h-[17.5rem] items-center rounded-2xl bg-primary-background px-12 py-10 pl-[8.625rem]"
                style={{
                  ...style,
                  transformOrigin: "top left",
                  translateX: "-50%",
                  translateY: "-50%",
                }}
              >
                <Dialog.Close className="absolute top-4 right-4 text-secondary-foreground transition-colors hover:text-primary-foreground">
                  <IconClose className="h-4 w-4" />
                </Dialog.Close>
                <BookThumbnail
                  className="-left-10 absolute top-9 h-52 border-4 border-primary-background shadow-xl"
                  isbn={data.detail.isbn}
                  jpeCode={data.detail.jpeCode}
                />
                <BookDetailContent
                  {...bookDetailProps}
                  className="w-[28rem] text-left"
                  Title={Dialog.Title}
                  Description={Dialog.Description}
                />
              </Content>
            )}
          </>
        ))}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
