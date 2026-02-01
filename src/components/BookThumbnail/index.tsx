import Image from "next/image";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import imageNoImage from "@/assets/images/noimage.webp";

type Props = {
  className?: string;
  thumbnailUrl?: string | null;
};

/**
 * 書籍のサムネイル画像を表示するコンポーネント。画像が取得できない場合はプレースホルダー画像を表示します。
 */
export default function BookThumbnail({ className, thumbnailUrl }: Props) {
  const imageBgStyle = "w-full object-contain";

  if (thumbnailUrl) {
    return (
      <Wrapper className={className}>
        {/* biome-ignore lint/performance/noImgElement: 外部URLの画像なのでNext.jsのImageコンポーネントを使用できない */}
        <img className={imageBgStyle} src={thumbnailUrl} alt="" />
      </Wrapper>
    );
  }

  return (
    <Wrapper className={className}>
      <Image className={imageBgStyle} src={imageNoImage} alt="" />
    </Wrapper>
  );
}

function Wrapper({ children, className }: { children: ReactNode } & Pick<Props, "className">) {
  return (
    <div
      className={twMerge(
        "flex aspect-[64/91] items-center justify-center overflow-hidden rounded-xl bg-secondary-background",
        className,
      )}
    >
      {children}
    </div>
  );
}
