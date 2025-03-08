import IconSearch from "@/assets/icons/search.svg";
import { type ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  /** 検索アイコンを表示 */
  search?: boolean;
} & ComponentPropsWithRef<"input">;

export default forwardRef<HTMLInputElement, Props>(function Input(
  { search, className, ...props },
  ref,
) {
  return (
    <div className={twMerge("relative text-primary-foreground", className)}>
      {search && (
        <IconSearch className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-4 h-4 w-4 text-primary-foreground" />
      )}
      <input
        {...props}
        ref={ref}
        className={twMerge(
          "w-full rounded-full bg-tertiary-background px-4 py-2 text-sm placeholder:text-secondary-foreground focus:outline focus:outline-2 focus:outline-accent",
          search && "pl-10",
        )}
        type={search ? "search" : "text"}
      />
    </div>
  );
});
