import { classNames } from "@/libs/classNames";
import { IconType } from "@/types/icon";
import { ComponentProps } from "react";

type Props = {
  Icon: IconType;
  text: string;
  selected?: boolean;
} & Omit<ComponentProps<"button">, "className">;

export default function StatusButton({
  Icon,
  text,
  selected = false,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={classNames(
        "h-full h-auto flex justify-center items-center w-full px-5 py-3 border rounded-full",
        selected
          ? "text-background bg-tako border-tako"
          : "text-text bg-background border-line transition hover:brightness-95",
      )}
      role="checkbox"
      aria-checked={selected}
      disabled={props.disabled || selected}
    >
      <Icon className="w-4 h-4" />
      <span className="ml-1">{text}</span>
    </button>
  );
}
