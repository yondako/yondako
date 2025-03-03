import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
} & Omit<ComponentPropsWithoutRef<"input">, "type" | "className">;

export default function CategoryButton({ label, ...props }: Props) {
  return (
    <label
      className={twMerge(
        "cursor-pointer rounded-full border border-accent px-5 py-1.5 text-xs transition hover:brightness-95 md:py-1",
        props.checked ? "bg-accent text-primary-background" : "text-accent",
      )}
    >
      <input type="radio" name="ndc" className="sr-only" {...props} />
      {label}
    </label>
  );
}
