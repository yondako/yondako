import { classNames } from "@/libs/classNames";
import type { IconType } from "@/types/icon";

type Props = {
  Icon: IconType;
  text: string;
  selected?: boolean;
};

export default function StatusButton({ Icon, text, selected = false }: Props) {
  return (
    <button
      className={classNames(
        "h-full lg:h-auto flex justify-center items-center w-full px-5 py-3 border rounded-xl",
        selected
          ? "text-background bg-tako border-tako"
          : "text-text bg-background border-line transition hover:brightness-95",
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="ml-1">{text}</span>
    </button>
  );
}
