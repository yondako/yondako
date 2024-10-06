"use client";

import { useOptimistic, useState } from "react";
import IconDotsVertical from "#src/assets/icons/dots-vertical.svg";
import type { BookType } from "#src/types/book";
import BookDetail from "../BookDetail";
import BookReadingStatusForm, {
  type BookReadingStatusFormProps,
} from "../BookReadingStatusForm";
import BookThumbnail from "../BookThumbnail";

type Props = {
  data: BookType;
};

export default function BookCard({ data }: Props) {
  const [displayReadingStatus, setDisplayReadingStatus] = useState(
    data.readingStatus,
  );
  const [optimisticStatus, addOptimisticStatus] =
    useOptimistic(displayReadingStatus);

  const formProps: BookReadingStatusFormProps = {
    status: displayReadingStatus,
    onChangeStatus: (status) => setDisplayReadingStatus(status),
    optimisticStatus,
    onChangeOptimisticStatus: (status) => addOptimisticStatus(status),
  };

  return (
    <div className="relative w-full text-left text-primary-foreground">
      <BookDetail bookDetailProps={{ data, ...formProps }}>
        <button className="mt-8 flex h-40 w-full flex-col justify-between overflow-hidden rounded-2xl bg-tertiary-background p-4 pl-36 text-left">
          <div className="space-y-1">
            <h3 className="palt line-clamp-3 font-bold text-sm leading-5">
              {data.detail.title}
            </h3>

            {data.detail.authors && (
              <p className="line-clamp-1 text-secondary-foreground text-xxs">
                {data.detail.authors.join(", ")}
              </p>
            )}
          </div>
        </button>
      </BookDetail>

      <BookReadingStatusForm
        className="absolute bottom-4 left-36"
        compact
        bookId={data.detail.ndlBibId}
        bookTitle={data.detail.title}
        {...formProps}
      />

      {/* ドロワーを開くボタンの名残り */}
      <IconDotsVertical className="pointer-events-none absolute right-5 bottom-6 block h-4 w-4 rounded-2xl" />

      <BookThumbnail
        className="pointer-events-none absolute top-4 left-4 w-28 border-4 border-tertiary-background shadow-xl"
        isbn={data.detail.isbn}
        jpeCode={data.detail.jpeCode}
      />
    </div>
  );
}
