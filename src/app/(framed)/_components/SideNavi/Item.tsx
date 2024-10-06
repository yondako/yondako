import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { NavItem } from "#src/constants/navi-items";

type Props = {
  current?: boolean;
  badge?: boolean;
} & Omit<NavItem, "matchSegmentsRegExp">;

export default function Item({
  title,
  IconSolid,
  IconFilled,
  href,
  current = false,
  badge = false,
}: Props) {
  const Icon = current ? IconFilled : IconSolid;
  const to = typeof href === "string" ? href : href.desktop;

  return (
    <Link
      className={twMerge(
        "flex cursor-pointer items-center space-x-3 rounded-r-full px-8 py-2 text-base",
        current
          ? "bg-accent text-primary-background"
          : "bg-primary-background text-primary-foreground transition hover:brightness-95",
      )}
      href={to}
      aria-current={current ? "page" : undefined}
    >
      <div className="relative">
        {badge && (
          <div
            className={twMerge(
              "-top-0.5 -right-0.5 absolute h-2 w-2 rounded-full bg-red-400",
              current &&
                "outline outline-1 outline-primary-background outline-offset-0",
            )}
            aria-label="新しい通知があります"
          />
        )}
        <Icon className="h-5 w-5" />
      </div>
      <span>{title}</span>
    </Link>
  );
}
