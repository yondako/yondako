import CommonLayout from "../Common";
import TabItem from "./TabItem";

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
          <TabItem {...item} current={item.title === current} />
        ))}
      </div>
      {props.children}
    </CommonLayout>
  );
}
