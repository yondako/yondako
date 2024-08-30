import imageNoImage from "@/assets/images/noimage.webp";
import Image from "next/image";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { createThumbnailUrl } from "./createThumbnailUrl";

type Props = {
  className?: string;
  isbn?: string | null;
  jpeCode?: string | null;
};

export function BookThumbnail({ className, isbn, jpeCode }: Props) {
  const imageBgStyle = "w-full object-contain";

  // 両方ある場合は ISBN -> JP-eコード の順に取得
  if (isbn && jpeCode) {
    return (
      <Wrapper className={className}>
        <object
          className={imageBgStyle}
          type="image/jpeg"
          data={createThumbnailUrl(isbn)}
        >
          <object
            className={imageBgStyle}
            type="image/jpeg"
            data={createThumbnailUrl(jpeCode)}
          >
            <Image className={imageBgStyle} src={imageNoImage} alt="" />
          </object>
        </object>
      </Wrapper>
    );
  }

  const isbnOrJpeCode = isbn || jpeCode;

  return (
    <Wrapper className={className}>
      {isbnOrJpeCode ? (
        <object
          className={imageBgStyle}
          type="image/jpeg"
          data={createThumbnailUrl(isbnOrJpeCode)}
        >
          <Image className={imageBgStyle} src={imageNoImage} alt="" />
        </object>
      ) : (
        <Image className={imageBgStyle} src={imageNoImage} alt="" />
      )}
    </Wrapper>
  );
}

function Wrapper({
  children,
  className,
}: { children: ReactNode } & Pick<Props, "className">) {
  return (
    <div
      className={twMerge(
        "flex aspect-[64/91] items-center justify-center overflow-hidden rounded-2xl bg-secondary-background",
        className,
      )}
    >
      {children}
    </div>
  );
}
