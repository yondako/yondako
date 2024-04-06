import type { IconType } from "react-icons";

type Props = {
  Icon: IconType;
  text: string;
};

export default function Tag({ Icon, text }: Props) {
  return (
    <p className="flex items-center">
      <Icon className="min-w-3.5 min-h-3.5 mr-1" />
      <span className="line-clamp-1">{text}</span>
    </p>
  );
}
