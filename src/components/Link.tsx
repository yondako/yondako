import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function Link({
  className,
  ...props
}: Omit<ComponentProps<"a">, "target" | "rel">) {
  return (
    <a
      {...props}
      className={twMerge(
        "transition-colors hover:text-tako hover:underline",
        className,
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  );
}
