import { readingStatusMetadata } from "@/constants/status";
import type { BookType } from "@/types/book";
import { twMerge } from "tailwind-merge";
import BookModal from "../BookModal";
import { BookThumbnail } from "../BookThumbnail";
import ReadingStatusBadge from "./ReadingStatusBadge";

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
      <button className="relative w-full text-left text-text transition-transform duration-500 ease-in-out hover:scale-105">
        <BookThumbnail
          className="absolute bottom-4 left-4 w-28"
          src={data.detail.thumbnailUrl}
        />

        <div className="mt-8 h-40 w-full rounded-2xl bg-card p-4 pl-36">
          <p className="line-clamp-3 font-bold text-sm leading-5">
            {data.detail.title}
          </p>

          {data.detail.authors && (
            <p className="mt-2 line-clamp-1 text-xxs">
              {data.detail.authors.join(", ")}
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
