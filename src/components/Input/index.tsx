import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function Input({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={twMerge(
        "w-full rounded-full bg-card px-4 py-2 text-base placeholder:text-text-sub focus:outline-tako md:text-sm",
        className,
      )}
    />
  );
}
