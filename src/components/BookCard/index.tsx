"use client";

import IconDotsVertical from "@/assets/icons/dots-vertical.svg";
import type { BookType } from "@/types/book";
import { useOptimistic, useState } from "react";
import BookDetail from "../BookDetail";
import BookReadingStatusForm, { type BookReadingStatusFormProps } from "../BookReadingStatusForm";
import BookThumbnail from "../BookThumbnail";

type Props = {
  data: BookType;
};

/**
 * 書籍の情報を表示するカードコンポーネント。クリックで詳細ダイアログが開きます。
 */
export default function BookCard({ data }: Props) {
  const [displayReadingStatus, setDisplayReadingStatus] = useState(data.readingStatus);

  const [optimisticStatus, addOptimisticStatus] = useOptimistic(displayReadingStatus);

  const formProps: BookReadingStatusFormProps = {
    status: displayReadingStatus,
    onChangeStatus: (status) => setDisplayReadingStatus(status),
    optimisticStatus,
    onChangeOptimisticStatus: (status) => addOptimisticStatus(status),
  };

  return (
    <div className="@container relative mt-8 w-full text-left text-primary-foreground transition hover:brightness-95">
      <BookDetail bookDetailProps={{ data, ...formProps }}>
        <button
          className="flex h-40 w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-tertiary-background p-4 pl-36 text-left"
          data-testid="book-card"
        >
          <div className="space-y-1">
            <h3 className="palt line-clamp-3 font-bold text-sm leading-5">{data.detail.title}</h3>

            {data.detail.authors && (
              <p className="line-clamp-1 text-secondary-foreground text-xxs">{data.detail.authors.join(", ")}</p>
            )}
          </div>
        </button>
      </BookDetail>

      <BookReadingStatusForm
        className="absolute bottom-4 left-36"
        compact
        identifiers={{
          ndlBibId: data.detail.ndlBibId,
          isbn: data.detail.isbn,
        }}
        bookTitle={data.detail.title}
        {...formProps}
      />

      {/* 書籍詳細を開くボタンの名残り */}
      <IconDotsVertical className="pointer-events-none absolute right-5 bottom-6 @xs:block hidden h-4 w-4 rounded-2xl text-secondary-foreground" />

      <BookThumbnail
        className="-top-4 pointer-events-none absolute left-4 h-full w-28 border-4 border-tertiary-background shadow-xl"
        isbn={data.detail.isbn}
        jpeCode={data.detail.jpeCode}
      />
    </div>
  );
}
