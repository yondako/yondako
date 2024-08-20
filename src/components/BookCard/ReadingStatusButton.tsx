import type { ReadingStatusMetadataItem } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";

type Props = {
  status: ReadingStatus;
  meta: ReadingStatusMetadataItem;
  selected: boolean;
};

export const readingStatusOrder: ReadingStatus[] = [
  "want_read",
  "reading",
  "read",
] as const;

export default function ReadingStatusButton({ status, meta, selected }: Props) {
  const Icon = selected ? meta.IconFilled : meta.IconSolid;

  return (
    <button
      className="rounded-2xl bg-tertiary-background px-3 py-1 transition hover:brightness-95"
      key={meta.label}
      title={meta.label}
      type="submit"
      name="status"
      value={selected ? "none" : status}
    >
      <Icon className="mx-auto h-5 w-5" />
    </button>
  );
}
