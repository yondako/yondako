import { twMerge } from "tailwind-merge";
import NotoColorEmojiTako from "@/assets/images/noto-color-emoji/emoji_u1f419.svg";

type Props = {
  message: string;
  className?: string;
};

/**
 * タコキャラクターがメッセージを言っているコンポーネント。吹き出しバブルでメッセージを表示します。
 */
export default function SayTako({ message, className }: Props) {
  return (
    <div className={twMerge("mx-auto mt-12 w-fit space-y-1 text-center", className)}>
      <p className="text-xs">{`\\ ${message} /`}</p>
      <NotoColorEmojiTako className="mx-auto h-12 w-12" />
    </div>
  );
}
