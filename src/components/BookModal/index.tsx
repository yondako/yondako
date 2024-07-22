"use client";

import IconBuilding from "@/assets/icons/building.svg";
import IconFeather from "@/assets/icons/feather.svg";
import { readingStatusMetadata } from "@/constants/status";
import type { BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import {
  Content,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from "@radix-ui/react-dialog";
import { type ReactNode, useOptimistic, useState } from "react";
import { BookThumbnail } from "../BookThumbnail";
import ReadingStatusButton from "./ReadingStatusButton";
import { ShopLinks } from "./ShopLinks";
import { Tags } from "./Tags";
import { toIsbn10 } from "@/lib/isbn";
import { updateReadingStatus } from "@/app/(authenticated)/_actions/updateReadingStatus";

const READING_STATUS_ORDER: ReadingStatus[] = [
  "want_read",
  "reading",
  "read",
] as const;

type Props = {
  data: BookType;
  children: ReactNode;
};

export default function BookModal({ data, children }: Props) {
  const [book, setBook] = useState(data);
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    book.readingStatus ?? "none",
  );

  // 読書ステータスが変更された
  const changeStatusFormAction = async (formData: FormData) => {
    const newStatus = formData.get("status") as BookType["readingStatus"];

    addOptimisticStatus(newStatus);

    const result = await updateReadingStatus(book.detail.ndlBibId, newStatus);

    // TODO: トーストとかでエラーを表示する
    if (result.error || !result.book) {
      console.error(result.error);
      return;
    }

    setBook(result.book);
  };

  const isbn10 = toIsbn10(book.detail.isbn);

  return (
    <Root modal>
      <Trigger asChild>{children}</Trigger>

      <Portal>
        <Overlay className="fixed inset-0 backdrop-blur-sm backdrop-brightness-90" />
        <Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 flex w-full max-w-xl flex-col justify-between rounded-2xl bg-card px-6 pt-6 pb-4 backdrop-blur-2xl">
          <div className="min-h-36 pl-[10.5rem]">
            <BookThumbnail
              className="-top-8 absolute left-6 w-36"
              src={book.detail.thumbnailUrl}
            />

            <Title className="line-clamp-3 font-bold text-lg leading-5">
              {book.detail.title}
            </Title>

            <div className="mt-4 space-y-2">
              <Tags Icon={IconFeather} items={book.detail.authors} />
              <Tags Icon={IconBuilding} items={book.detail.publishers} />
            </div>

            {isbn10 && <ShopLinks isbn10={isbn10} />}
          </div>

          <form
            className="m-0 flex w-full justify-between px-4 pt-6 text-tako"
            action={changeStatusFormAction}
          >
            {READING_STATUS_ORDER.map((status) => {
              const meta = readingStatusMetadata.get(status);

              return meta ? (
                <ReadingStatusButton
                  status={status}
                  meta={meta}
                  selected={optimisticStatus === status}
                  key={status}
                />
              ) : null;
            })}
          </form>
        </Content>
      </Portal>
    </Root>
  );
}
