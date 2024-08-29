import IconClose from "@/assets/icons/x.svg";
import * as Dialog from "@radix-ui/react-dialog";
import { BookThumbnail } from "../BookThumbnail";
import BookDetailContent from "./Content";
import type { BookDetailProps } from "./props";

export default function BookDetailDialog({
  bookDetailProps,
  children,
  ...props
}: BookDetailProps) {
  const { data } = bookDetailProps;

  return (
    <Dialog.Root {...props}>
      {children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 flex min-h-[17.5rem] items-center rounded-2xl bg-primary-background px-12 py-10 pl-[8.625rem]">
          <Dialog.Close className="absolute top-4 right-4 text-secondary-foreground transition-colors hover:text-primary-foreground">
            <IconClose className="h-4 w-4" />
          </Dialog.Close>
          <BookThumbnail
            className="-left-10 absolute top-9 h-52 border-4 border-primary-background shadow-xl"
            src={data.detail.thumbnailUrl}
          />
          <BookDetailContent
            {...bookDetailProps}
            className="w-[28rem] text-left"
            Title={Dialog.Title}
            Description={Dialog.Description}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
