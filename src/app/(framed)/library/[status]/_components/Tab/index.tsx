import { readingStatusMetadata, readingStatusOrder } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import { TabItem } from "./TabItem";

type Props = {
  current: ReadingStatus;
};

export default function Tab({ current }: Props) {
  return (
    <div className="mx-auto flex w-full rounded-full bg-tertiary-background lg:w-fit">
      {readingStatusOrder.map((status) => {
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
