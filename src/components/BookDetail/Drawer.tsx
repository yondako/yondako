import { Drawer } from "vaul";
import { BookThumbnail } from "../BookThumbnail";
import BookDetailContent from "./Content";
import type { BookDetailProps } from "./props";

export default function BookDetailDrawer({
  bookDetailProps,
  children,
  ...props
}: BookDetailProps) {
  return (
    <Drawer.Root {...props} preventScrollRestoration={false}>
      {children && <Drawer.Trigger asChild>{children}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 rounded-t-2xl bg-primary-background px-6 pb-8">
          <Drawer.Handle className="mt-2 bg-primary-foreground" />
          <BookThumbnail
            className="mx-auto mt-8 h-40 border border-secondary-border"
            isbn={bookDetailProps.data.detail.isbn}
            jpeCode={bookDetailProps.data.detail.jpeCode}
          />
          <BookDetailContent
            {...bookDetailProps}
            className="mt-4 max-w-sm"
            Title={Drawer.Title}
            Description={Drawer.Description}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
