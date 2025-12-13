import { type ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentPropsWithRef<"select">;

/**
 * ドロップダウン選択用のSelectコンポーネント。Inputコンポーネントと同じスタイルで統一されています。
 */
export default forwardRef<HTMLSelectElement, Props>(function Select({ className, children, ...props }, ref) {
  return (
    <div className={twMerge("relative text-primary-foreground", className)}>
      <select
        {...props}
        ref={ref}
        className="w-full appearance-none rounded-full bg-tertiary-background px-4 py-2 pr-10 text-sm placeholder:text-secondary-foreground focus:outline focus:outline-2 focus:outline-accent"
      >
        {children}
      </select>
      <span
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 h-4 w-4 bg-[image:var(--background-image-chevron-down)] bg-center bg-no-repeat"
        aria-hidden="true"
      />
    </div>
  );
});
