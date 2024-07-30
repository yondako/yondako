import { twMerge } from "tailwind-merge";

type Props = {
  title: string;
  className?: string;
};

export function Loading({ title, className }: Props) {
  return (
    <div
      className={twMerge(
        "flex h-full flex-col items-center justify-center space-y-4 text-center",
        className,
      )}
    >
      <p className="animate-bounce cursor-grab font-noto-emoji">₍₍⁽⁽🐙₎₎⁾⁾</p>
      <p className="text-xs">{title}</p>
    </div>
  );
}
