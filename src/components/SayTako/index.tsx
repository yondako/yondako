import NotoColorEmojiTako from "@/assets/images/noto-color-emoji/emoji_u1f419.svg";
import { twMerge } from "tailwind-merge";

type Props = {
  message: string;
  className?: string;
};

export default function SayTako({ message, className }: Props) {
  return (
    <div
      className={twMerge(
        "mx-auto mt-12 w-fit space-y-1 text-center",
        className,
      )}
    >
      <p className="text-xs">{`\\ ${message} /`}</p>
      <NotoColorEmojiTako className="h-12 w-12" />
    </div>
  );
}
