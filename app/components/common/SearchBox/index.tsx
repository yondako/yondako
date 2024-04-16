import { classNames } from "@/libs/classNames";
import { ComponentPropsWithRef } from "react";
import { IconSearch } from "../Icon/Search";

export default function SearchBox(props: ComponentPropsWithRef<"input">) {
  return (
    <div className="relative text-text">
      <IconSearch className="absolute w-4 w-4 mt-[1px] top-1.5 left-4 text-gray-400" />
      <input
        {...props}
        className={classNames(
          "w-full px-4 pl-10 py-2 text-sm border border-line rounded-full",
          props.className,
        )}
        placeholder="書籍タイトル・著者名から"
      />
    </div>
  );
}
