import { Slot } from "@radix-ui/react-slot";
import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  asChild?: boolean;
} & ComponentPropsWithRef<"button">;

export default function Button({ asChild, className, ...props }: Props) {
  const style = twMerge(
    "px-5 py-3 border border-text rounded-full text-center text-text bg-background transition hover:brightness-95",
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
