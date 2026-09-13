import { libraryStatusMetadata } from "@/constants/status";
import { type LibraryStatus, libraryStatusValues } from "@/types/readingStatus";
import { TabItem } from "./TabItem";

type Props = {
  current: LibraryStatus;
};

/**
 * ライブラリ全体とステータス別の表示を切り替えるタブ
 */
export default function Tab({ current }: Props) {
  return (
    <div className="mx-auto w-full pb-10 lg:w-fit">
      <div className="flex rounded-full bg-tertiary-background">
        {libraryStatusValues.map((status) => {
          const item = libraryStatusMetadata.get(status);

          return item ? <TabItem id={status} meta={item} current={status === current} key={status} /> : null;
        })}
      </div>
    </div>
  );
}
