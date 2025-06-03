import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
} & Omit<ComponentPropsWithoutRef<"input">, "type" | "className">;

/**
 * 検索フィルター内でNDCカテゴリーを選択するためのボタンコンポーネント。ラジオボタンの仕組みで、選択状態を視覚的に表現します。
 */
export default function CategoryButton({ label, ...props }: Props) {
  return (
    <div className="contents">
      <input type="radio" name="ndc" className="peer sr-only" {...props} />
      <label
        className={twMerge(
          "cursor-pointer rounded-full border border-accent px-5 py-1.5 text-xs transition hover:brightness-95 md:py-1",
          "text-accent peer-checked:bg-accent peer-checked:text-primary-background",
        )}
        htmlFor={props.id}
      >
        {label}
      </label>
    </div>
  );
}
