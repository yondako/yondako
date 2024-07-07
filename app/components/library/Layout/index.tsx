import CommonLayout from "@/components/common/Layout";
import { ReadingStatus } from "@/types/book";
import { ComponentProps } from "react";
import Tab from "../Tab";

type Props = {
  current: Exclude<ReadingStatus, "none">;
} & ComponentProps<"div">;

export default function LibraryLayout({ current, ...props }: Props) {
  return (
    <CommonLayout current="ライブラリ" {...props}>
      <Tab current={current} />
      {props.children}
    </CommonLayout>
  );
}
