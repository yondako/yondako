import { Slot } from "@radix-ui/react-slot";

type Props = {
  title: string;
  current?: boolean;
} & JSX.IntrinsicElements["a"];

export default function Item({ title, current = false, ...props }: Props) {
  const style = current
    ? "text-background bg-tako"
    : "text-text bg-background transition hover:brightness-95";

  return (
    <a
      {...props}
      className={`flex items-center px-8 py-2 text-base rounded-r-full space-x-3 cursor-pointer ${style}`}
    >
      <Slot className="w-5 h-5">{props.children}</Slot>
      <span>{title}</span>
    </a>
  );
}
