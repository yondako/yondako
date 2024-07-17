import { readingStatusMetadata } from "@/constants/status";
import type { ReadingStatus } from "@/types/book";
import { TabItem } from "./TabItem";

const READING_STATUS_ORDER: ReadingStatus[] = [
  "reading",
  "want_read",
  "read",
] as const;

type Props = {
  current: string;
};

export default function Tab({ current }: Props) {
  return (
    <div className="mx-auto flex w-full rounded-full bg-card md:w-fit">
      {READING_STATUS_ORDER.map((status) => {
        const item = readingStatusMetadata.get(status);
        return item ? (
          <TabItem
            id={status}
            meta={item}
            current={status === current}
            key={status}
          />
        ) : null;
      })}
    </div>
  );
}
