"use client";

import { toIsbn10 } from "@/lib/isbn";
import type { BookType } from "@/types/book";
import { useState } from "react";
import Overlay from "./Overlay";
import ReadingStatusBadge from "./ReadingStatusBadge";
import { BookThumbnail } from "./Thumbnail";

export type BookCardProps = {
  data: BookType;
  hideReadingStatusBadge?: boolean;
};

export default function BookCard({
  data,
  hideReadingStatusBadge = false,
}: BookCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isbn10 = toIsbn10(data.detail.isbn);

  return (
    <div
      className="relative w-full text-left text-text"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="relative mt-8 h-40 w-full overflow-hidden rounded-2xl bg-card p-4 pl-36">
        {isVisible && (
          <div className="absolute inset-0 z-10 flex h-full w-full flex-col justify-center bg-card">
            <Overlay
              bookId={data.detail.ndlBibId}
              isbn10={isbn10}
              readingStatus={data.readingStatus}
            />
          </div>
        )}

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

      {!isVisible && (
        <BookThumbnail
          className="absolute bottom-4 left-4 w-28"
          src={data.detail.thumbnailUrl}
        />
      )}
    </div>
  );
}
