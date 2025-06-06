import { readingStatusMetadata, readingStatusOrder } from "@/constants/status";
import type { ReadingStatus } from "@/types/readingStatus";
import { TabItem } from "./TabItem";

type Props = {
  current: ReadingStatus;
};

/**
 * ライブラリページの読書ステータス切り替え用タブコンポーネント。よみたい・読書中・読みおわったの3つのステータスを切り替えて書籍リストを絞り込みます。
 */
export default function Tab({ current }: Props) {
  return (
    <div className="mx-auto w-full pb-10 lg:w-fit">
      <div className="flex rounded-full bg-tertiary-background">
        {readingStatusOrder.map((status) => {
          const item = readingStatusMetadata.get(status);

          return item ? <TabItem id={status} meta={item} current={status === current} key={status} /> : null;
        })}
      </div>
    </div>
  );
}
