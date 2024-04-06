import { BiBuilding } from "react-icons/bi";
import { FaRegFaceMeh } from "react-icons/fa6";
import { LuBookMarked, LuPenLine } from "react-icons/lu";
import { MdCheck } from "react-icons/md";
import LikeButton from "./LikeButton";
import StatusButton from "./StatusButton";
import Tag from "./Tag";

// TODO: APIのレスポンス型をそのまま使いたい
type Props = {
  book: {
    title: string;
    description: string; // 今は使わないけど持っておきたい
    authors: string[];
    publisher: string;
    genre: string;
    imageUrl: string;
  };
  liked: boolean;
  status: "none" | "read" | "want_read";
};

export default function Book({ book, liked, status }: Props) {
  return (
    <div className="h-40 flex space-x-4">
      <div className="min-w-32 text-center bg-background border border-line rounded-md overflow-hidden">
        <img
          className="inline h-full aspect-ratio"
          src={book.imageUrl}
          alt={book.title}
        />
      </div>

      <div className="flex flex-col w-full py-1">
        <div className="flex justify-between items-start space-x-3">
          <div className="space-y-2">
            <h2 className="font-bold text-base leading-6 line-clamp-2">
              {book.title}
            </h2>
            <div className="flex items-center space-x-2 text-text text-xs">
              <Tag Icon={LuPenLine} text={book.authors.join(", ")} />
              <Tag Icon={BiBuilding} text={book.publisher} />
            </div>
          </div>
          <LikeButton liked={liked} />
        </div>

        <div className="mt-2 flex flex-grow items-end space-x-2 text-xs whitespace-nowrap">
          <StatusButton
            Icon={FaRegFaceMeh}
            text="よんでない"
            selected={status === "none"}
          />
          <StatusButton
            Icon={LuBookMarked}
            text="よむ"
            selected={status === "read"}
          />
          <StatusButton
            Icon={MdCheck}
            text="よんだ"
            selected={status === "want_read"}
          />
        </div>
      </div>
    </div>
  );
}
