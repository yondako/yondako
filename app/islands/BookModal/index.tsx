import { BookThumbnail } from "@/components/common/BookThumbnail";
import { readingStatusMetadata } from "@/constants/status";
import { toIsbn10 } from "@/libs/isbn";
import { BookStatusType } from "@/routes/api/book";
import { BookType, ReadingStatus } from "@/types/book";
import {
  Content,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from "@radix-ui/react-dialog";
import { hc } from "hono/client";
import { ReactNode, useOptimistic, useState } from "react";
import ReadingStatusButton from "./ReadingStatusButton";
import { ShopLinks } from "./ShopLinks";
import { Tags } from "./Tags";
import { Building, Feather } from "@/components/common/Icons";

const READING_STATUS_ORDER: ReadingStatus[] = [
  "want_read",
  "reading",
  "read",
] as const;

const client = hc<BookStatusType>("/api/book");

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

    const res = await client[":id"].status.$post({
      param: {
        id: book.info.ndlBibId,
      },
      json: {
        status: newStatus,
      },
    });

    if (res.ok) {
      const json = await res.json();
      setBook(json);
    }

    // TODO: トーストとかでエラーを表示する
    if (res.status === 404) {
      const json = await res.json();
      console.error(json.error);
    }
  };

  return (
    <Root modal>
      <Trigger asChild>{children}</Trigger>

      <Portal>
        <Overlay className="fixed inset-0 backdrop-blur-sm backdrop-brightness-90" />
        <Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between w-full max-w-xl px-6 pt-6 pb-4 bg-card rounded-2xl backdrop-blur-2xl">
          <div className="min-h-36 pl-[10.5rem]">
            <BookThumbnail
              className="absolute -top-8 left-6 w-36"
              src={book.info.thumbnailUrl}
            />

            <Title className="font-bold text-lg leading-5 line-clamp-3">
              {book.info.title}
            </Title>

            <div className="mt-4 space-y-2">
              <Tags Icon={Feather} items={book.info.authors} />
              <Tags Icon={Building} items={book.info.publishers} />
            </div>

            {book.info.isbn && <ShopLinks isbn10={toIsbn10(book.info.isbn)} />}
          </div>

          <form
            className="m-0 px-4 pt-6 w-full flex justify-between text-tako"
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
