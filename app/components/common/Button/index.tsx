import { Slot } from "@radix-ui/react-slot";

type Props = {
  /** 子要素に置き換える */
  asChild?: boolean;
} & JSX.IntrinsicElements["button"];

export default function Button({ asChild, ...props }: Props) {
  const style =
    "max-w-sm px-5 py-3 border border-line rounded-full bg-background text-center transition hover:brightness-95";

  return asChild ? (
    <Slot className={style}>{props.children}</Slot>
  ) : (
    <button {...props} className={`${style} ${props.className}`}>
      {props.children}
    </button>
  );
}
