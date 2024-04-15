import imageNoImage from "@/assets/images/noimage.webp";
import { BookType } from "@/types/book";
import { IconBookmark } from "../Icon/Bookmark";
import { IconBuilding } from "../Icon/Building";
import { IconCheck } from "../Icon/Check";
import { IconMoodEmpty } from "../Icon/MoodEmpty";
import { IconPencil } from "../Icon/Pencil";
import LikeButton from "./LikeButton";
import StatusButton from "./StatusButton";
import Tag from "./Tag";

// TODO: APIのレスポンス型をそのまま使いたい
export type BookProps = {
  book: BookType;
  liked: boolean;
  status: "none" | "read" | "want_read";
};

export default function Book({ book, liked, status }: BookProps) {
  return (
    <div className="h-40 grid grid-cols-[5rem_1fr] lg:grid-cols-[8rem_1fr] grid-rows-2 lg:grid-rows-3 gap-3 lg:gap-4">
      <div className="row-span-2 lg:row-span-3 flex justify-center items-center bg-background border border-line rounded-md overflow-hidden">
        <object
          className="w-full h-full object-contain"
          type="image/jpeg"
          data={book.thumbnailUrl}
        >
          <img src={imageNoImage} alt="" />
        </object>
      </div>

      <div className="pt-1 row-span-1 lg:row-span-1 flex justify-between items-start space-x-3">
        <h2 className="font-bold text-base lg:text-lg leading-5 lg:leading-6 line-clamp-2">
          {book.title}
        </h2>
        <LikeButton liked={liked} />
      </div>

      <div className="row-span-1 lg:content-center space-y-1 text-text text-xs">
        {book.authors && (
          <Tag Icon={IconPencil} text={book.authors.join(", ")} />
        )}
        {book.publisher && (
          <Tag Icon={IconBuilding} text={book.publisher.join(", ")} />
        )}
      </div>

      <div className="lg:pb-1 col-span-2 lg:col-span-1 flex items-end space-x-2 text-xs whitespace-nowrap">
        <StatusButton
          Icon={IconMoodEmpty}
          text="よんでない"
          selected={status === "none"}
        />
        <StatusButton
          Icon={IconBookmark}
          text="よむ"
          selected={status === "read"}
        />
        <StatusButton
          Icon={IconCheck}
          text="よんだ"
          selected={status === "want_read"}
        />
      </div>
    </div>
  );
}
