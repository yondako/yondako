import { readingStatusMetadata } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import type { ComponentPropsWithoutRef } from "react";
import BookReadingStatusButton, {
  type BookReadingStatusButtonProps,
} from "./ReadingStatusButton";

const order: ReadingStatus[] = ["want_read", "reading", "read"] as const;

type Props = {
  currentStatus: ReadingStatus;
} & Pick<BookReadingStatusButtonProps, "compact"> &
  ComponentPropsWithoutRef<"form">;

export default function BookReadingStatusForm({
  currentStatus,
  compact,
  ...props
}: Props) {
  return (
    <form {...props}>
      {order.map((status) => {
        const meta = readingStatusMetadata.get(status);

        return meta ? (
          <BookReadingStatusButton
            status={status}
            meta={meta}
            selected={status === currentStatus}
            key={status}
          />
        ) : null;
      })}
    </form>
  );
}
