import { ReadingStatusMetadataItem } from "@/constants/status";
import { ReadingStatus } from "@/types/book";

type Props = {
  status: ReadingStatus;
  meta: ReadingStatusMetadataItem;
  selected: boolean;
};

export default function ReadingStatusButton({ status, meta, selected }: Props) {
  const Icon = selected ? meta.IconFilled : meta.IconSolid;

  return (
    <button
      className="w-20 h-14 bg-card rounded-2xl transition hover:brightness-95"
      key={meta.label}
      type="submit"
      name="status"
      value={status}
      disabled={selected}
    >
      <Icon className="mx-auto mb-1 w-6 h-6" />
      <span className="text-xxs">{meta.label}</span>
    </button>
  );
}
