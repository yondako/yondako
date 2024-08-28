import type { DialogProps } from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import BookDetail, { type BookDetailProps } from "../BookDetail";
import { BookThumbnail } from "../BookThumbnail";

type Props = {
  bookDetailProps: Omit<BookDetailProps, "Title" | "Description">;
} & DialogProps;

export default function BookDrawer({
  bookDetailProps,
  children,
  ...props
}: Props) {
  return (
    <Drawer.Root {...props}>
      {children && <Drawer.Trigger asChild>{children}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 rounded-t-2xl bg-primary-background px-6 pb-8">
          <Drawer.Handle className="mt-2 bg-primary-foreground" />
          <BookThumbnail
            className="mx-auto mt-8 h-40 border border-secondary-border"
            src={bookDetailProps.data.detail.thumbnailUrl}
          />
          <BookDetail
            {...bookDetailProps}
            Title={Drawer.Title}
            Description={Drawer.Description}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
