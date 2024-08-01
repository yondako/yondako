import IconSearch from "@/assets/icons/search.svg";
import type { ComponentPropsWithRef } from "react";
import Input from "../Input";
import { twMerge } from "tailwind-merge";

export default function SearchBox({
  className,
  ...props
}: ComponentPropsWithRef<"input">) {
  return (
    <div className="relative text-text">
      <IconSearch className="-translate-y-1/2 absolute top-1/2 left-4 w-5 w-5 text-text md:w-4 md:w-4" />
      <Input {...props} className={twMerge("pl-10", className)} />
    </div>
  );
}
