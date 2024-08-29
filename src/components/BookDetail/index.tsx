import { useMedia } from "react-use";
import BookDetailDialog from "./Dialog";
import BookDetailDrawer from "./Drawer";
import type { BookDetailProps } from "./props";

export default function BookDetail(props: BookDetailProps) {
  const isDesktopWidth = useMedia("(min-width: 1024px)");

  return isDesktopWidth ? (
    <BookDetailDialog {...props} />
  ) : (
    <BookDetailDrawer {...props} />
  );
}
