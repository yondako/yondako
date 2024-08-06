import { type ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export default forwardRef<HTMLInputElement, ComponentPropsWithRef<"input">>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        {...props}
        ref={ref}
        className={twMerge(
          "w-full rounded-full bg-card px-4 py-2 text-base placeholder:text-text-sub focus:outline-tako lg:text-sm",
          className,
        )}
      />
    );
  },
);
