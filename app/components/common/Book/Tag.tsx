import type { IconType } from "react-icons";

type Props = {
  Icon: IconType;
  text: string;
};

export default function Tag({ Icon, text }: Props) {
  return (
    <p className="flex items-center">
      <Icon className="mr-1 text-sm" />
      <span className="line-clamp-1">{text}</span>
    </p>
  );
}
