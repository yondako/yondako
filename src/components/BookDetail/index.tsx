import type { DialogProps } from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";
import IconDotsVertical from "@/assets/icons/dots-vertical.svg";
import { useLibraryRevalidation } from "@/contexts/LibraryRevalidationContext";
import { useModalState } from "@/contexts/ModalStateContext";
import { revalidateLibraryCacheImmediate } from "@/hooks/useLibraryBooks";
import AdaptiveModalDrawer from "../AdaptiveModalDrawer";
import ShareDropdownMenu from "../BookCard/ShareDropdownMenu";
import BookThumbnail from "../BookThumbnail";
import type { BookDetailContentProps } from "./Content";
import BookDetailContent from "./Content";

type Props = {
  bookDetailProps: Omit<BookDetailContentProps, "Title" | "Description">;
} & Omit<DialogProps, "defaultOpen" | "modal">;

/**
 * 書籍の詳細情報を表示するダイアログコンポーネント
 * デスクトップではモーダル、モバイルではドロワーとして表示されます
 */
export default function BookDetail({ bookDetailProps, children, ...props }: Props) {
  const { setIsModalOpen } = useModalState();
  const { executePendingRevalidations } = useLibraryRevalidation();

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    props.onOpenChange?.(open);
  };

  const handleAnimationEnd = (open: boolean) => {
    // モーダル表示時にライブラリの再検証を実行すると、ページの再描画が走ってモーダルが消えてしまうので
    // 閉じるアニメーションが完了したタイミングで保留中の再検証を実行する
    if (!open) {
      const pendingRevalidations = executePendingRevalidations();

      for (const revalidation of pendingRevalidations) {
        revalidateLibraryCacheImmediate(revalidation);
      }
    }
  };

  return (
    <AdaptiveModalDrawer
      contentClassName="lg:px-12 lg:pl-[8.625rem] lg:min-h-[17.5rem]"
      triggerChildren={children}
      onOpenChange={handleOpenChange}
      onAnimationEnd={handleAnimationEnd}
      {...props}
    >
      {({ Title, Description }) => (
        <>
          <div
            className={twMerge(
              "relative mx-auto mx-auto mt-8 w-fit overflow-hidden rounded-2xl border border-secondary-border",
              "lg:-left-10 lg:absolute lg:top-0 lg:overflow-visible lg:border-none",
            )}
          >
            <BookThumbnail
              className={twMerge("h-40 ", "lg:h-52 lg:border-4 lg:border-primary-background lg:shadow-xl")}
              isbn={bookDetailProps.data.detail.isbn}
              jpeCode={bookDetailProps.data.detail.jpeCode}
            />
            <ShareDropdownMenu ndlUrl={bookDetailProps.data.detail.link} bookTitle={bookDetailProps.data.detail.title}>
              <button
                className="absolute right-0 bottom-0 cursor-pointer bg-primary-background pt-3 pr-2 pb-2 pl-3 text-secondary-foreground transition [border-radius:99px_0_1.5rem_0;] hover:brightness-95"
                aria-label="共有メニューを開く"
              >
                <IconDotsVertical className="h-4 w-4" />
              </button>
            </ShareDropdownMenu>
          </div>
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
