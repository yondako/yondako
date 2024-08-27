import { Slot } from "@radix-ui/react-slot";
import type { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  asChild?: boolean;
  noBorder?: boolean;
} & ComponentPropsWithRef<"button">;

export default function Button({
  asChild,
  noBorder,
  className,
  ...props
}: Props) {
  const style = twMerge(
    "px-5 py-3 rounded-full text-center transition hover:brightness-95",
    noBorder
      ? "bg-tertiary-background"
      : "border border-primary-border bg-primary-background",
    className,
  );

  return asChild ? (
    <Slot className={style}>{props.children}</Slot>
  ) : (
    <button {...props} className={style}>
      {props.children}
    </button>
  );
}
