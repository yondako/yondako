"use client";

import * as RadixSwitch from "@radix-ui/react-switch";
import { twMerge } from "tailwind-merge";

/**
 * オン/オフの切り替えを行うSwitchコンポーネント。ダークモード切り替えなどの設定項目で使用されます。
 */
export default function Switch({ className, ...props }: RadixSwitch.SwitchProps) {
  return (
    <RadixSwitch.Root
      className={twMerge(
        "h-fit w-12 shrink-0 rounded-full bg-secondary-foreground p-1 outline-none data-[state=checked]:bg-accent",
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
