import { classNames } from "@/libs/classNames";
import Button from "../Button";
import { IconStarFill, IconStarLine } from "../Icon/Star";

type Props = {
  liked?: boolean;
};

export default function LikeButton({ liked = false }: Props) {
  const Icon = liked ? IconStarFill : IconStarLine;

  return (
    <Button
      className={classNames(
        "text-base",
        liked ? "text-background bg-star" : "text-text",
      )}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
}
