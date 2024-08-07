import IconX from "@/assets/icons/x.svg";
import { useRef } from "react";
import { useClickAway } from "react-use";
import { ShopLinks, type ShopLinksProps } from "./ShopLinks";

type DetailProps = {
  open: boolean;
  onChangeOpen: (value: boolean) => void;
} & ShopLinksProps;

export default function Detail({ open, onChangeOpen, rawIsbn }: DetailProps) {
  const ref = useRef<HTMLDivElement>(null);

  const close = () => {
    onChangeOpen(false);
  };

  useClickAway(ref, close);

  return open ? (
    <div
      className="relative flex h-full w-full flex-col justify-center"
      ref={ref}
    >
      <p className="flex items-center font-bold text-xs">詳しくみる</p>

      <div className="my-2 flex w-full space-x-1">
        <div className="h-1 w-2 rounded-full bg-tako" />
        <div className="h-1 w-2 rounded-full bg-tako" />
        <div className="h-1 w-2 rounded-full bg-tako" />
      </div>

      <div className="mb-2 flex max-w-80 flex-wrap gap-x-3 gap-y-1">
        <ShopLinks rawIsbn={rawIsbn} />
      </div>

      <button
        className="absolute right-0 bottom-0 rounded-2xl bg-card p-1 transition hover:brightness-95"
        onClick={close}
      >
        <IconX className="h-4 w-4" />
      </button>
    </div>
  ) : null;
}
