import { classNames } from "@/libs/classNames";
import Button from "../Button";
import { FaRegStar, FaStar } from "react-icons/fa6";

type Props = {
  liked?: boolean;
};

export default function LikeButton({ liked = false }: Props) {
  return (
    <Button
      className={classNames(
        "absolute top-0 right-0 text-base",
        liked ? "text-background bg-star" : "text-text",
      )}
    >
      {liked ? <FaStar /> : <FaRegStar />}
    </Button>
  );
}
