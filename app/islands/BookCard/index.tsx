import { BookThumbnail } from "@/components/common/BookThumbnail";
import { readingStatusMetadata } from "@/constants/status";
import { BookType } from "@/types/book";
import { twMerge } from "tailwind-merge";
import BookModal from "../BookModal";

export type BookCardProps = {
  data: BookType;
  hideReadingStatusBadge?: boolean;
};

export default function BookCard({
  data,
  hideReadingStatusBadge = false,
}: BookCardProps) {
  return (
    <BookModal data={data}>
      <button className="relative w-full text-left text-text transition-transform ease-in-out duration-500 hover:scale-105">
        <BookThumbnail
          className="absolute bottom-4 left-4 w-28"
          src={data.info.thumbnailUrl}
        />

        <div className="w-full h-40 mt-8 p-4 pl-36 bg-card rounded-2xl">
          <p className="font-bold text-sm leading-5 line-clamp-3">
            {data.info.title}
          </p>

          {data.info.authors && (
            <p className="mt-2 text-xxs line-clamp-1">
              {data.info.authors.join(", ")}
            </p>
          )}

          {!hideReadingStatusBadge && (
            <ReadingStatusBadge status={data.readingStatus ?? "none"} />
          )}
        </div>
      </button>
    </BookModal>
  );
}

/**
 * 読書ステータスのバッジ
 *
 * status が none なら破線のボーダー、それ以外は背景色ありで表示
 */
function ReadingStatusBadge({ status }: { status: BookType["readingStatus"] }) {
  const item = readingStatusMetadata.get(status);

  if (!item) {
    return null;
  }

  const Icon = status === "none" ? item.IconSolid : item.IconFilled;

  return (
    <div
      className={twMerge(
        "absolute bottom-4 right-4 px-3 py-1 flex items-center space-x-1 text-xs rounded-full",
        status === "none"
          ? "text-tako border border-dashed border-tako"
          : "text-card bg-tako ",
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{item.label}</span>
    </div>
  );
}
