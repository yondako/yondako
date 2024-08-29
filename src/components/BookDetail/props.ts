import type { DialogProps } from "@radix-ui/react-dialog";
import type { BookDetailContentProps } from "./Content";

export type BookDetailProps = {
  bookDetailProps: Omit<BookDetailContentProps, "Title" | "Description">;
} & DialogProps;
