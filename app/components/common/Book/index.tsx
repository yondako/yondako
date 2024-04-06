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
    <div className="h-40 grid grid-cols-[5rem_1fr] lg:grid-cols-[8rem_1fr] grid-rows-3 lg:grid-rows-2 gap-3">
      <div className="row-span-2 w-full text-center bg-background border border-line rounded-md overflow-hidden">
        <img
          className="inline h-full aspect-ratio"
          src={book.imageUrl}
          alt={book.title}
        />
      </div>

      <div className="pt-1 row-span-2 lg:row-span-1 flex flex-col w-full">
        <div className="flex justify-between items-start space-x-3">
          <div className="space-y-1 lg:space-y-2">
            <h2 className="font-bold text-lg leading-6 line-clamp-2">
              {book.title}
            </h2>
            <div className="space-y-1 text-text text-xs">
              <Tag Icon={LuPenLine} text={book.authors.join(", ")} />
              <Tag Icon={BiBuilding} text={book.publisher} />
            </div>
          </div>
          <LikeButton liked={liked} />
        </div>
      </div>

      <div className="lg:pb-1 col-span-2 lg:col-span-1 flex items-end space-x-2 text-xs whitespace-nowrap">
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
  );
}
