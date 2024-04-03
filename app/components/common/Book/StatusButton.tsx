import { classNames } from "@/libs/classNames";
import type { IconType } from "react-icons";

type Props = {
  Icon: IconType;
  text: string;
  selected?: boolean;
};

export default function StatusButton({ Icon, text, selected = false }: Props) {
  return (
    <button
      className={classNames(
        "flex justify-center items-center w-full px-5 py-4 rounded-xl",
        selected
          ? "text-background bg-tako"
          : "text-text bg-background border border-line transition hover:brightness-95",
      )}
    >
      <Icon className="text-sm" />
      <span className="ml-1">{text}</span>
    </button>
  );
}
