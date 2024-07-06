import { Description } from "@radix-ui/react-dialog";
import { FunctionComponent, SVGProps } from "react";

type Props = {
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  items: string[] | undefined;
};

export function Tags({ Icon, items }: Props) {
  return items && items.length > 0 ? (
    <Description className="flex items-center space-x-1">
      <Icon className="w-4 h-4" />
      <span className="text-xs line-clamp-1">{items.join(", ")}</span>
    </Description>
  ) : null;
}
