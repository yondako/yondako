import IconSearch from "@/assets/icons/search.svg?react";
import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

export default function SearchBox({
  className,
  ...props
}: ComponentPropsWithRef<"input">) {
  return (
    <div className="relative text-text">
      <IconSearch className="absolute w-5 md:w-4 w-5 md:w-4 mt-[3px] md:mt-[1px] top-1.5 left-4 text-gray-400" />
      <input
        {...props}
        className={twMerge(
          "w-full px-4 pl-10 py-2 text-base md:text-sm border border-line rounded-full focus:outline-tako",
          className,
        )}
      />
    </div>
  );
}
