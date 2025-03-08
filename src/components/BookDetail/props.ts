import type { AdaptiveModalDrawerProps } from "../AdaptiveModalDrawer/props";
import type { BookDetailContentProps } from "./Content";

export type BookDetailProps = {
  bookDetailProps: Omit<BookDetailContentProps, "Title" | "Description">;
} & AdaptiveModalDrawerProps;
