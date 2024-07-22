import { Description } from "@radix-ui/react-dialog";
import type { FunctionComponent, SVGProps } from "react";

type Props = {
  Icon: FunctionComponent<SVGProps<SVGElement>>;
  items: string[] | undefined;
};

export function Tags({ Icon, items }: Props) {
  return items && items.length > 0 ? (
    <Description className="flex items-center space-x-1">
      <Icon className="h-4 w-4" />
      <span className="line-clamp-1 text-xs">{items.join(", ")}</span>
    </Description>
  ) : null;
}
