import { useRef } from "react";
import { useClickAway } from "react-use";
import { ShopLinks, type ShopLinksProps } from "./ShopLinks";
import IconX from "@/assets/icons/x.svg";

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
      <p className="font-bold font-noto-emoji text-xs">{"この本を買う🐙"}</p>
      <div className="mt-3 mb-2 flex flex-wrap gap-1">
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
