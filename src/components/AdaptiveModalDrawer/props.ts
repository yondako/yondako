import type {
  Close,
  Description,
  DialogProps,
  Title,
} from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

export type AdaptiveModalDrawerProps = {
  contentClassName?: string;
  children?: (components: {
    Title: typeof Title;
    Description: typeof Description;
    Close: typeof Close;
  }) => ReactNode;
  triggerChildren?: ReactNode;
} & Omit<DialogProps, "children">;
