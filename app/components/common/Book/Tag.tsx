import type { IconType } from "@/types/icon";

type Props = {
  Icon: IconType;
  text: string;
};

export default function Tag({ Icon, text }: Props) {
  return (
    <p className="mt-1 flex items-center">
      <Icon className="shrink-0 w-3 h-3" />
      <span className="ml-1 text-xxs line-clamp-1">{text}</span>
    </p>
  );
}
