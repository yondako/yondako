import { twMerge } from "tailwind-merge";

type Props = {
  message: string;
  className?: string;
};

export default function SayTako({ message, className }: Props) {
  return (
    <div
      className={twMerge(
        "mx-auto mt-12 w-fit space-y-1 text-center",
        className,
      )}
    >
      <p className="text-xs">{`\\ ${message} /`}</p>
      <p>🐙</p>
    </div>
  );
}
