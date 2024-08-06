import imageNoImage from "@/assets/images/noimage.webp";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
  src: string | null | undefined;
};

export function BookThumbnail({ src, className }: Props) {
  const imageBgStyle = "w-full object-contain";

  return (
    <div
      className={twMerge(
        "flex aspect-[64/91] items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-background-sub shadow-xl",
        className,
      )}
    >
      {typeof src === "string" ? (
        <object className={imageBgStyle} type="image/jpeg" data={src}>
          <Image className={imageBgStyle} src={imageNoImage} alt="" />
        </object>
      ) : (
        <Image className={imageBgStyle} src={imageNoImage} alt="" />
      )}
    </div>
  );
}
