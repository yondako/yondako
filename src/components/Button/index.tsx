import { Slot } from "@radix-ui/react-slot";
import type { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  asChild?: boolean;
  style?: "accent" | "noBorder";
} & Omit<ComponentPropsWithRef<"button">, "style">;

/**
 * 汎用的なボタンコンポーネント。複数のスタイルバリエーションを提供し、リンクとしても使用できます。
 */
export default function Button({ asChild, className, style, ...props }: Props) {
  const baseStyle =
    "px-6 py-3 rounded-full text-center transition hover:brightness-95 cursor-pointer";

  let styleVariant =
    "border-2 text-primary border-primary-foreground bg-primary-background";

  switch (style) {
    case "accent":
      styleVariant = "border-2 text-accent border-accent bg-primary-background";
      break;
    case "noBorder":
      styleVariant = "bg-tertiary-background";
      break;
  }

  const mergedClassname = twMerge(baseStyle, styleVariant, className);

  return asChild ? (
    <Slot className={mergedClassname}>{props.children}</Slot>
  ) : (
    <button {...props} className={mergedClassname}>
      {props.children}
    </button>
  );
}
