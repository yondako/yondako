import imageNoImage from "@/assets/images/noimage.webp";
import Tag from "@/components/common/Book/Tag";
import { IconPencil } from "@/components/common/Icon/Pencil";
import { BookType } from "@/types/book";

type Props = {
  data: BookType;
};

export default function Book({ data }: Props) {
  return (
    <div className="w-full h-full max-w-32">
      <Thumbnail src={data.info.thumbnailUrl} />

      <p className="mt-2 font-bold text-sm leading-4 line-clamp-2">
        {data.info.title}
      </p>

      {data.info.authors && (
        <Tag Icon={IconPencil} text={data.info.authors.join(", ")} />
      )}
    </div>
  );
}

function Thumbnail({ src }: { src: string | null | undefined }) {
  const imageBgStyle = "w-full h-full object-contain bg-background-sub";

  return (
    <div className="flex justify-center items-center bg-background border border-line rounded-md overflow-hidden aspect-[64/91]">
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
