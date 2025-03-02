import type { Description, Title } from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";

type Props = {
  title: string;
  description: string;
  Title: typeof Title;
  Description: typeof Description;
  className?: string;
};

export default function Label({
  title,
  description,
  Title,
  Description,
  className,
}: Props) {
  return (
    <>
      <Title className={twMerge("font-bold", className)}>{title}</Title>
      <Description className="mt-0.5 text-secondary-foreground text-xs">
        {description}
      </Description>
    </>
  );
}
