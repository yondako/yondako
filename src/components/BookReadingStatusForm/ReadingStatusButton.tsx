import { twMerge } from "tailwind-merge";
import type { ReadingStatusMetadataItem } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";

export type BookReadingStatusButtonProps = {
  status: ReadingStatus;
  meta: ReadingStatusMetadataItem;
  selected: boolean;
  compact?: boolean;
};

/**
 * 読書ステータスを表示・変更するためのボタンコンポーネント。選択中のステータスをハイライト表示し、クリックでステータスを変更できます。コンパクトモードもサポートしています。
 */
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
        "cursor-pointer rounded-2xl px-3 py-1 transition hover:brightness-95",
        compact ? "bg-tertiary-background" : "space-y-1 bg-primary-background",
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
