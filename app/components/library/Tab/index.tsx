import {
  ReadingStatusMetadataItem,
  readingStatusMetadata,
} from "@/constants/status";
import { ReadingStatus } from "@/types/book";
import { twMerge } from "tailwind-merge";

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
    <div className="flex w-fit mx-auto bg-card rounded-full">
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

type TabItemProps = {
  id: string;
  meta: ReadingStatusMetadataItem;
  current?: boolean;
};

function TabItem({ id, meta, current }: TabItemProps) {
  const Icon = current ? meta.IconFilled : meta.IconSolid;

  return (
    <a
      className={twMerge(
        "flex justify-center items-center w-full min-w-32 px-4 py-2 text-xs text-center rounded-full space-x-2",
        current
          ? "font-bold bg-tako text-background"
          : "transition hover:bg-card hover:brightness-95",
      )}
      href={`/library/${id}`}
    >
      <Icon className="w-4 h-4" />
      <span>{meta.label}</span>
    </a>
  );
}
