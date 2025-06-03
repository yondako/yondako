import type { DialogProps } from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";
import AdaptiveModalDrawer from "../AdaptiveModalDrawer";
import BookThumbnail from "../BookThumbnail";
import type { BookDetailContentProps } from "./Content";
import BookDetailContent from "./Content";

type Props = {
  bookDetailProps: Omit<BookDetailContentProps, "Title" | "Description">;
} & Omit<DialogProps, "defaultOpen" | "modal">;

/**
 * 書籍の詳細情報を表示するダイアログコンポーネント。デスクトップではモーダル、モバイルではドロワーとして表示されます。
 */
export default function BookDetail({ bookDetailProps, children, ...props }: Props) {
  return (
    <AdaptiveModalDrawer
      contentClassName="lg:px-12 lg:pl-[8.625rem] lg:min-h-[17.5rem]"
      triggerChildren={children}
      {...props}
    >
      {({ Title, Description }) => (
        <>
          <BookThumbnail
            className={twMerge(
              "mx-auto mt-8 h-40 border border-secondary-border",
              "lg:-left-10 lg:absolute lg:top-0 lg:h-52 lg:border-4 lg:border-primary-background lg:shadow-xl",
            )}
            isbn={bookDetailProps.data.detail.isbn}
            jpeCode={bookDetailProps.data.detail.jpeCode}
          />
          <BookDetailContent
            {...bookDetailProps}
            className={twMerge("mt-4 max-w-sm", "lg:mt-0 lg:w-[28rem] lg:max-w-none lg:text-left")}
            Title={Title}
            Description={Description}
          />
        </>
      )}
    </AdaptiveModalDrawer>
  );
}
