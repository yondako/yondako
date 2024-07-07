import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { Search } from "../Icons";

export default function SearchBox({
  className,
  ...props
}: ComponentPropsWithRef<"input">) {
  return (
    <div className="relative text-text">
      <Search className="absolute w-5 md:w-4 w-5 md:w-4 top-1.5 left-4 text-text" />
      <input
        {...props}
        className={twMerge(
          "w-full px-4 pl-10 py-2 text-base md:text-sm bg-card rounded-full focus:outline-tako placeholder:text-text-sub",
          className,
        )}
      />
    </div>
  );
}
