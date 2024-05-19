import Button from "@/components/common/Button";
import { IconStarFill, IconStarLine } from "@/components/common/Icon/Star";
import { classNames } from "@/libs/classNames";

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
