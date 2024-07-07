import imageNoImage from "@/assets/images/noimage.webp";
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
        "flex justify-center items-center bg-background-sub border border-line rounded-2xl shadow-lg overflow-hidden aspect-[64/91]",
        className,
      )}
    >
      {typeof src === "string" ? (
        <object className={imageBgStyle} type="image/jpeg" data={src}>
          <img className={imageBgStyle} src={imageNoImage} alt="" />
        </object>
      ) : (
        <img className={imageBgStyle} src={imageNoImage} alt="" />
      )}
    </div>
  );
}
