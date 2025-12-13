declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module "*.svg?url" {
  // biome-ignore lint/suspicious/noExplicitAny: SVGファイルのURL importは動的な型のためany型を使用
  const content: any;
  export default content;
}
