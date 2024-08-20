import IconSearch from "@/assets/icons/search.svg";
import { type ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import Input from "../Input";

export default forwardRef<HTMLInputElement, ComponentPropsWithRef<"input">>(
  function SearchBox({ className, ...props }, ref) {
    return (
      <div className="relative text-primary-text">
        <IconSearch className="-translate-y-1/2 absolute top-1/2 left-4 w-5 w-5 text-primary-text lg:w-4 lg:w-4" />
        <Input {...props} ref={ref} className={twMerge("pl-10", className)} />
      </div>
    );
  },
);
