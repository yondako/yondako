"use client";

import { useMedia } from "react-use";
import BookDetailDialog from "./Dialog";
import BookDetailDrawer from "./Drawer";
import type { BookDetailProps } from "./props";

export default function BookDetail(
  props: Omit<BookDetailProps, "defaultOpen" | "modal">,
) {
  const isDesktopWidth = useMedia("(min-width: 1024px)", false); // Tailwind の lg 幅

  return isDesktopWidth ? (
    <BookDetailDialog {...props} />
  ) : (
    <BookDetailDrawer {...props} />
  );
}
