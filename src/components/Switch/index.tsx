"use client";

import * as RadixSwitch from "@radix-ui/react-switch";
import { twMerge } from "tailwind-merge";

export default function Switch({
  className,
  ...props
}: RadixSwitch.SwitchProps) {
  return (
    <RadixSwitch.Root
      className={twMerge(
        "h-fit w-12 rounded-full bg-secondary-foreground p-1 outline-none data-[state=checked]:bg-accent",
        className,
      )}
      {...props}
    >
      <RadixSwitch.Thumb
        className={
          "block h-5 w-5 rounded-full bg-white transition-transform duration-100 data-[state=checked]:translate-x-5"
        }
      />
    </RadixSwitch.Root>
  );
}
