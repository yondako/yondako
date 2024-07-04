import CommonLayout from "@/components/common/Layout";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const tabItems = [
  {
    title: "よんでる",
    href: "/library/reading",
  },
  {
    title: "よみたい",
    href: "/library/want_read",
  },
  {
    title: "よんだ",
    href: "/library/read",
  },
] as const;

type Props = {
  current: (typeof tabItems)[number]["title"];
} & ComponentProps<"div">;

export default function LibraryLayout({ current, ...props }: Props) {
  return (
    <CommonLayout current="ライブラリ" {...props}>
      <div className="flex w-fit mx-auto px-6 border border-line rounded-full">
        {tabItems.map((item) => (
          <TabItem {...item} current={item.title === current} key={item.href} />
        ))}
      </div>
      {props.children}
    </CommonLayout>
  );
}

type TabItemProps = {
  title: string;
  href: `/${string}`;
  current?: boolean;
};

function TabItem({ title, href, current }: TabItemProps) {
  return (
    <a
      className={twMerge(
        "block w-full min-w-20 px-4 py-2 text-xs text-center rounded-full",
        current
          ? "relative font-bold after:absolute after:inset-x-0 after:-bottom-px after:w-full after:border-b-2 after:border-tako"
          : "transition-colors hover:bg-background",
      )}
      href={href}
    >
      {title}
    </a>
  );
}
