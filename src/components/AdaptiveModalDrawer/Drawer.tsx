import { Drawer as VaulDrawer } from "vaul";
import type { AdaptiveModalDrawerProps } from "./props";

export default function Drawer({
  triggerChildren,
  children,
  ...props
}: AdaptiveModalDrawerProps) {
  return (
    <VaulDrawer.Root {...props} preventScrollRestoration={false}>
      {triggerChildren && (
        <VaulDrawer.Trigger asChild>{triggerChildren}</VaulDrawer.Trigger>
      )}
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <VaulDrawer.Content className="fixed inset-x-0 bottom-0 rounded-t-2xl bg-primary-background px-6 pb-8">
          <VaulDrawer.Handle className="mt-2 bg-primary-foreground" />
          {children?.({
            Title: VaulDrawer.Title,
            Description: VaulDrawer.Description,
          })}
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
