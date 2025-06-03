import type { Description, Title } from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";

type Props = {
  title: string;
  description: string;
  Title: typeof Title;
  Description: typeof Description;
  className?: string;
};

/**
 * 検索フィルター内でセクションのラベルと説明を表示するコンポーネント。アクセシビリティを考慮し、スクリーンリーダーにも対応しています。
 */
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
