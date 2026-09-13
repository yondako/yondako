import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { ReadingStatusMetadataItem } from "@/constants/status";

type TabItemProps = {
  id: string;
  meta: ReadingStatusMetadataItem;
  current?: boolean;
};

/**
 * ライブラリタブ内の個別アイテムコンポーネント。アクティブ状態、ホバー状態をサポートし、アイコンとラベルで読書ステータスを表現します。
 */
export function TabItem({ id, meta, current }: TabItemProps) {
  const Icon = current ? meta.IconFilled : meta.IconSolid;

  return (
    <Link
      className={twMerge(
        "flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 py-2 text-center text-xs sm:gap-2 sm:px-4 lg:min-w-32",
        current
          ? "bg-accent font-bold text-primary-background"
          : "transition hover:bg-tertiary-background hover:brightness-95",
      )}
      href={`/library/${id}`}
      aria-current={current ? "page" : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{meta.label}</span>
    </Link>
  );
}
