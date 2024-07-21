import { readingStatusMetadata } from "@/constants/status";
import type { BookType } from "@/types/book";
import { twMerge } from "tailwind-merge";
import { BookThumbnail } from "./BookThumbnail";

export type BookCardProps = {
  data: BookType;
  hideReadingStatusBadge?: boolean;
};

export default function BookCard({
  data,
  hideReadingStatusBadge = false,
}: BookCardProps) {
  return (
    <button className="relative w-full text-left text-text transition-transform duration-500 ease-in-out hover:scale-105">
      <BookThumbnail
        className="absolute bottom-4 left-4 w-28"
        src={data.info.thumbnailUrl}
      />

      <div className="mt-8 h-40 w-full rounded-2xl bg-card p-4 pl-36">
        <p className="line-clamp-3 font-bold text-sm leading-5">
          {data.info.title}
        </p>

        {data.info.authors && (
          <p className="mt-2 line-clamp-1 text-xxs">
            {data.info.authors.join(", ")}
          </p>
        )}

        {!hideReadingStatusBadge && (
          <ReadingStatusBadge status={data.readingStatus ?? "none"} />
        )}
      </div>
    </button>
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
        "absolute right-4 bottom-4 flex items-center space-x-1 rounded-full px-3 py-1 text-xs",
        status === "none"
          ? "border border-tako border-dashed text-tako"
          : "bg-tako text-card ",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </div>
  );
}
