import { Drawer as VaulDrawer } from "vaul";
import type { AdaptiveModalDrawerProps } from "./props";

/**
 * モバイル環境でボトムシートドロワーとして表示される適応型コンポーネント。画面下部からスライドアップして表示され、ドラッグまたは背景タップで閉じることができます。
 */
export default function Drawer({ triggerChildren, children, ...props }: AdaptiveModalDrawerProps) {
  return (
    <VaulDrawer.Root {...props} preventScrollRestoration={false}>
      {triggerChildren && <VaulDrawer.Trigger asChild>{triggerChildren}</VaulDrawer.Trigger>}
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <VaulDrawer.Content className="fixed inset-x-0 bottom-0 flex max-h-[95dvh] flex-col rounded-t-2xl bg-primary-background">
          <VaulDrawer.Handle className="mt-2 shrink-0 bg-primary-foreground" />
          <div className="overflow-y-auto px-6 pb-8">
            {children?.({
              Title: VaulDrawer.Title,
              Description: VaulDrawer.Description,
              Close: VaulDrawer.Close,
            })}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
