import type { BookType } from "@/types/book";
import type {
  DialogDescriptionProps,
  DialogTitleProps,
} from "@radix-ui/react-dialog";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { twMerge } from "tailwind-merge";
import BookReadingStatusForm, {
  type BookReadingStatusFormProps,
} from "../BookReadingStatusForm";
import { DescriptionBlock } from "./DescriptionBlock";
import ECLinks from "./ECLinks";

export type BookDetailContentProps = {
  data: BookType;
  Title: ForwardRefExoticComponent<
    DialogTitleProps & RefAttributes<HTMLHeadingElement>
  >;
  Description: ForwardRefExoticComponent<
    DialogDescriptionProps & RefAttributes<HTMLParagraphElement>
  >;
} & Pick<
  BookReadingStatusFormProps,
  "status" | "onChangeStatus" | "optimisticStatus" | "onChangeOptimisticStatus"
>;

export default function BookDetailContent({
  data,
  Title,
  Description,
  status,
  optimisticStatus,
  onChangeOptimisticStatus,
  onChangeStatus,
  className,
}: BookDetailContentProps & { className?: string }) {
  const { title, authors, publishers, isbn } = data.detail;

  return (
    <div className={twMerge("mx-auto", className)}>
      <Title
        className="palt line-clamp-3 text-center font-bold"
        data-testid="book-title"
      >
        {title}
      </Title>

      {(authors || publishers) && (
        <Description asChild>
          <div className="mt-4 flex justify-center rounded-2xl bg-tertiary-background px-4 py-2">
            {authors && <DescriptionBlock label="著者" values={authors} />}
            {authors && publishers && (
              <div className="mx-4 w-[1px] bg-secondary-foreground" />
            )}
            {publishers && (
              <DescriptionBlock label="出版社" values={publishers} />
            )}
          </div>
        </Description>
      )}

      <div className="mt-8">
        <BookReadingStatusForm
          className="mx-auto w-fit space-x-10"
          bookId={data.detail.ndlBibId}
          bookTitle={data.detail.title}
          status={status}
          optimisticStatus={optimisticStatus}
          onChangeStatus={onChangeStatus}
          onChangeOptimisticStatus={onChangeOptimisticStatus}
        />
      </div>

      {isbn && <ECLinks isbn={isbn} />}
    </div>
  );
}
