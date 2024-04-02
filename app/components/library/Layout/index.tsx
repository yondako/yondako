import CommonLayout from "@/components/common/Layout";
import { classNames } from "@/libs/classNames";

const tabItems = [
  {
    title: "読む本",
    href: "/library",
  },
  {
    title: "読んだ本",
    href: "/library/read",
  },
  {
    title: "好きな本",
    href: "/library/likes",
  },
] as const;

type Props = {
  current: (typeof tabItems)[number]["title"];
} & JSX.IntrinsicElements["div"];

export default function LibraryLayout({ current, ...props }: Props) {
  return (
    <CommonLayout current="ライブラリ" {...props}>
      <div className="flex md:block w-full border-b border-line text-base md:text-sm">
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
    ? "font-bold after:absolute after:inset-x-0 after:-bottom-px after:w-full after:border-b-2 after:border-tako"
    : "transition-colors hover:text-tako";

  return (
    <a
      className={classNames(
        "relative inline-block w-full md:w-auto px-4 pb-2 text-center md:text-left",
        style,
      )}
      href={href}
    >
      {title}
    </a>
  );
}
