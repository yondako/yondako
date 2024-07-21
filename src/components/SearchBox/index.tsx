import IconSearch from "@/assets/icons/search.svg";
import type { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

export default function SearchBox({
  className,
  ...props
}: ComponentPropsWithRef<"input">) {
  return (
    <div className="relative text-text">
      <IconSearch className="-translate-y-1/2 absolute top-1/2 left-4 w-5 w-5 text-text md:w-4 md:w-4" />
      <input
        {...props}
        className={twMerge(
          "w-full rounded-full bg-card px-4 py-2 pl-10 text-base placeholder:text-text-sub focus:outline-tako md:text-sm",
          className,
        )}
      />
    </div>
  );
}
