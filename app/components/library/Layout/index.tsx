import CommonLayout from "@/components/common/Layout";
import { classNames } from "@/libs/classNames";
import { ComponentProps } from "react";

const tabItems = [
  {
    title: "よむ",
    href: "/library",
  },
  {
    title: "よんだ",
    href: "/library/read",
  },
  {
    title: "これすき",
    href: "/library/likes",
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
  const style = current
    ? "relative font-bold after:absolute after:inset-x-0 after:-bottom-px after:w-full after:border-b-2 after:border-tako"
    : "transition-colors hover:text-tako";

  return (
    <a
      className={classNames(
        "block w-full min-w-20 px-4 py-2 text-xs text-center",
        style,
      )}
      href={href}
    >
      {title}
    </a>
  );
}
