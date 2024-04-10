import CommonLayout from "@/components/common/Layout";
import { classNames } from "@/libs/classNames";

const tabItems = [
  {
    title: "よむ本",
    href: "/library",
  },
  {
    title: "よんだ本",
    href: "/library/read",
  },
  {
    title: "すきな本",
    href: "/library/likes",
  },
] as const;

type Props = {
  current: (typeof tabItems)[number]["title"];
} & JSX.IntrinsicElements["div"];

export default function LibraryLayout({ current, ...props }: Props) {
  return (
    <CommonLayout current="ライブラリ" {...props}>
      <div className="flex lg:block w-full border-b border-line text-base lg:text-sm">
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
        "relative inline-block w-full lg:w-auto px-4 pb-2 text-center lg:text-left",
        style,
      )}
      href={href}
    >
      {title}
    </a>
  );
}
