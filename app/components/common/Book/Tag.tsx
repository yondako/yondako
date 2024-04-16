import type { IconType } from "@/types/icon";

type Props = {
  Icon: IconType;
  text: string;
};

export default function Tag({ Icon, text }: Props) {
  return (
    <p className="flex items-center">
      <Icon className="shrink-0 w-4 h-4 mr-1" />
      <span className="line-clamp-1">{text}</span>
    </p>
  );
}
