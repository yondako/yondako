import type { IconType } from "react-icons";

type Props = {
  Icon: IconType;
  text: string;
};

export default function Tag({ Icon, text }: Props) {
  return (
    <span className="inline-flex items-center py-0.5">
      <Icon className="mr-1 text-sm" />
      {text}
    </span>
  );
}
