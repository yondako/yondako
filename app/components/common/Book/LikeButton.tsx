import { classNames } from "@/libs/classNames";
import { FaRegStar, FaStar } from "react-icons/fa6";
import Button from "../Button";

type Props = {
  liked?: boolean;
};

export default function LikeButton({ liked = false }: Props) {
  return (
    <Button
      className={classNames(
        "text-base",
        liked ? "text-background bg-star" : "text-text",
      )}
    >
      {liked ? <FaStar /> : <FaRegStar />}
    </Button>
  );
}
