import { classNames } from "@/libs/classNames";

type Props = {
  title: string;
  href: `/${string}`;
  current?: boolean;
};

export default function TabItem({ title, href, current }: Props) {
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
