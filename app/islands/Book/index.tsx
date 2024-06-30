import IconChevronRight from "@/assets/icons/chevron-right.svg?react";
import imageNoImage from "@/assets/images/noimage.webp";
import { BookType } from "@/types/book";

type Props = {
  data: BookType;
};

export default function Book({ data }: Props) {
  return (
    <div className="relative text-background">
      <Thumbnail src={data.info.thumbnailUrl} />

      <div className="w-full h-40 mt-10 p-4 pl-40 bg-tako rounded-xl">
        <p className="font-bold text-base leading-5 line-clamp-4">
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
  const imageBgStyle = "w-full h-full object-contain bg-background-sub";

  return (
    <div className="absolute bottom-4 left-4 w-32 flex justify-center items-center bg-background border border-line rounded-xl shadow-md overflow-hidden aspect-[64/91]">
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
