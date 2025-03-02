import type { Description, DialogProps, Title } from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

export type AdaptiveModalDrawerProps = {
  contentClassName?: string;
  children?: (components: {
    Title: typeof Title;
    Description: typeof Description;
  }) => ReactNode;
  triggerChildren?: ReactNode;
} & Omit<DialogProps, "children">;
