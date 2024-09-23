import type { NavItem } from "@/constants/navi-items";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

type Props = {
  current?: boolean;
} & Omit<NavItem, "matchSegmentsRegExp">;

export default function Item({
  title,
  IconSolid,
  IconFilled,
  href,
  current = false,
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
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </Link>
  );
}
