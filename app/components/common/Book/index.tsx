import { BiBuilding } from "react-icons/bi";
import { FaRegFaceMeh } from "react-icons/fa6";
import { LuBookMarked, LuPenLine } from "react-icons/lu";
import { MdCheck } from "react-icons/md";
import Tag from "./Tag";
import StatusButton from "./StatusButton";
import LikeButton from "./LikeButton";

// TODO: APIのレスポンス型をそのまま使いたい
type Props = {
  book: {
    title: string;
    description: string;
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
    <div className="flex h-40 space-x-4">
      <img
        className="block h-full aspect-ratio rounded-md"
        src={book.imageUrl}
        alt={book.title}
      />
      <div className="relative flex flex-col w-full py-1">
        <h2 className="font-bold text-lg leading-6">{book.title}</h2>

        <LikeButton liked={liked} />

        <div className="flex items-center mt-2 space-x-2 text-text text-xs">
          <Tag Icon={LuPenLine} text={book.authors.join(", ")} />
          <Tag Icon={BiBuilding} text={book.publisher} />
        </div>

        <p className="mt-2 text-xs">{book.description}</p>

        <div className="flex flex-grow items-end space-x-2 text-xs">
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
