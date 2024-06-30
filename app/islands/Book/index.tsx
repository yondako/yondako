import IconChevronRight from "@/assets/icons/chevron-right.svg?react";
import imageNoImage from "@/assets/images/noimage.webp";
import { BookType } from "@/types/book";

type Props = {
  data: BookType;
};

export default function Book({ data }: Props) {
  return (
    <div className="relative text-text">
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
      </div>

      <button className="absolute bottom-4 right-4 flex items-center space-x-1 text-sm">
        <IconChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

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
