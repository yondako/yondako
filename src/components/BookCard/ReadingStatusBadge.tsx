import { readingStatusMetadata } from "@/constants/status";
import type { BookType } from "@/types/book";
import { twMerge } from "tailwind-merge";

export default function ReadingStatusBadge({
  status,
}: { status: BookType["readingStatus"] }) {
  const item = readingStatusMetadata.get(status);

  if (!item) {
    return null;
  }

  const Icon = status === "none" ? item.IconSolid : item.IconFilled;

  return (
    <div
      className={twMerge(
        "absolute right-4 bottom-4 flex items-center space-x-1 rounded-full px-3 py-1",
        status === "none"
          ? "border border-accent border-dashed text-accent"
          : "bg-accent text-tertiary-background ",
      )}
    >
      <Icon className="h-3 w-3" />
      <span className="text-xxs">{item.label}</span>
    </div>
  );
}
