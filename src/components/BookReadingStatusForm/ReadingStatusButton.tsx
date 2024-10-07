import type { ReadingStatusMetadataItem } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import { twMerge } from "tailwind-merge";

export type BookReadingStatusButtonProps = {
  status: ReadingStatus;
  meta: ReadingStatusMetadataItem;
  selected: boolean;
  compact?: boolean;
};

export default function BookReadingStatusButton({
  status,
  meta,
  selected,
  compact = false,
}: BookReadingStatusButtonProps) {
  const Icon = selected ? meta.IconFilled : meta.IconSolid;

  return (
    <button
      className={twMerge(
        "rounded-2xl px-3 py-1 transition",
        compact ? "bg-tertiary-background hover:brightness-95" : "space-y-1",
      )}
      key={meta.label}
      title={meta.label}
      type="submit"
      name="status"
      value={selected ? "none" : status}
      data-testid={`button-status-${status}`}
    >
      <Icon className={twMerge("mx-auto", compact ? "h-5 w-5" : "h-6 w-6")} />
      {!compact && <p className="text-xxs">{meta.label}</p>}
    </button>
  );
}
