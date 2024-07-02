import imageNoImage from "@/assets/images/noimage.webp";
import { statusList } from "@/constants/status";
import { BookType } from "@/types/book";
import { twMerge } from "tailwind-merge";

type Props = {
  data: BookType;
};

export default function Book({ data }: Props) {
  return (
    <div className="relative text-text transition-transform ease-in-out duration-500 hover:scale-105">
      <Thumbnail src={data.info.thumbnailUrl} />

      <div className="w-full h-36 mt-8 p-4 pl-36 bg-card rounded-2xl">
        <p className="font-bold text-sm leading-5 line-clamp-3">
          {data.info.title}
        </p>

        {data.info.authors && (
          <p className="mt-2 text-xs line-clamp-1">
            {data.info.authors.join(", ")}
          </p>
        )}

        <ReadingStatusBadge status={data.readingStatus ?? "none"} />
      </div>
    </div>
  );
}

/**
 * 書影
 */
function Thumbnail({ src }: { src: string | null | undefined }) {
  const imageBgStyle = "w-full object-contain";

  return (
    <div className="absolute bottom-4 left-4 w-28 flex justify-center items-center bg-background-sub border border-line rounded-2xl shadow-lg overflow-hidden aspect-[64/91]">
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

/**
 * 読書ステータスのバッジ
 *
 * status が none なら破線のボーダー、それ以外は背景色ありで表示
 */
function ReadingStatusBadge({ status }: { status: BookType["readingStatus"] }) {
  const item = statusList.get(status);

  if (!item) {
    return null;
  }

  const Icon = status === "none" ? item.IconSolid : item.IconFilled;

  return (
    <div
      className={twMerge(
        "absolute bottom-4 right-4 px-3 py-1 flex items-center space-x-1 text-xs rounded-full",
        status === "none"
          ? "text-tako border border-dashed border-tako"
          : "text-card bg-tako ",
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{item.label}</span>
    </div>
  );
}
