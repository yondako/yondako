import { classNames } from "@/libs/classNames";
import { Slot } from "@radix-ui/react-slot";

type ItemProps = {
  title: string;
  icon: JSX.Element;
  href: `/${string}`;
  current?: boolean;
};

export default function Item({
  title,
  icon,
  href,
  current = false,
}: ItemProps) {
  const style = current
    ? "text-background bg-tako"
    : "text-text bg-background transition hover:brightness-95";

  return (
    <a
      className={classNames(
        "flex items-center px-8 py-2 text-base rounded-r-full space-x-3 cursor-pointer",
        style,
      )}
      href={href}
    >
      <Slot className="w-5 h-5">{icon}</Slot>
      <span>{title}</span>
    </a>
  );
}
