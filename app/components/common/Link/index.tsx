import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function Link({
  className,
  ...props
}: Omit<ComponentProps<"a">, "target" | "rel">) {
  return (
    <a
      {...props}
      className={twMerge(
        "hover:underline hover:text-tako transition-colors",
        className,
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  );
}
