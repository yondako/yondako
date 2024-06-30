import type { IconType } from "@/types/icon";

type Props = {
  text: string;
  Icon?: IconType;
};

export default function Tag({ text, Icon }: Props) {
  return (
    <p className="mt-1 flex items-center">
      {Icon && <Icon className="shrink-0 w-3 h-3 mt-1" />}
      <span className="text-xxs line-clamp-1">{text}</span>
    </p>
  );
}
