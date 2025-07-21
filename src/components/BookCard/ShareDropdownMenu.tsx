import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { animated, useTransition } from "@react-spring/web";
import { type PropsWithChildren, useState } from "react";
import { toast } from "sonner";
import { useDevice } from "@/contexts/DeviceContext";

type Props = PropsWithChildren<{
  ndlUrl: string;
  bookTitle?: string;
}>;

export default function ShareDropdownMenu({ children, ndlUrl, bookTitle }: Props) {
  const [open, setOpen] = useState(false);
  const { isDesktop } = useDevice();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ndlUrl);
      toast.success("リンクをコピーしました");
    } catch {
      toast.error("リンクのコピーに失敗しました");
    }
  };

  const handleShare = async () => {
    // デスクトップの場合、またはWebShare APIが利用できない場合はしぇあ.comを使用
    if (isDesktop || !navigator.share) {
      openShareSite();
      return;
    }

    try {
      await navigator.share({ title: bookTitle, url: ndlUrl });
    } catch (error) {
      // ユーザーがキャンセルした場合は何もしない
      if ((error as Error).name !== "AbortError") {
        openShareSite();
      }
    }
  };

  const openShareSite = () => {
    const shareText = bookTitle ? `${bookTitle}\n${ndlUrl}` : ndlUrl;
    const shareUrl = new URL("https://しぇあ.com");
    shareUrl.searchParams.set("text", shareText);

    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  };

  const transitions = useTransition(open, {
    from: {
      opacity: 0,
      transform: "scaleY(0.8) translateY(-8px)",
    },
    enter: {
      opacity: 1,
      transform: "scaleY(1) translateY(0px)",
    },
    leave: {
      opacity: 0,
      transform: "scaleY(0.8) translateY(-8px)",
    },
    config: {
      tension: 300,
      friction: 20,
    },
  });

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Portal forceMount>
        {transitions((style, item) =>
          item ? (
            <DropdownMenu.Content asChild sideOffset={8} align="end">
              <animated.div
                className="min-w-[280px] origin-top overflow-hidden rounded-lg border border-secondary-border bg-primary-background shadow-lg"
                style={style}
              >
                <DropdownMenu.Item
                  className="flex h-12 cursor-pointer select-none items-center px-4 text-primary-foreground text-sm outline-none transition-colors hover:bg-secondary-background focus:bg-secondary-background"
                  onSelect={handleCopyLink}
                >
                  リンクをコピー
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-[1px] bg-secondary-border" />
                <DropdownMenu.Item
                  className="flex h-12 cursor-pointer select-none items-center px-4 text-primary-foreground text-sm outline-none transition-colors hover:bg-secondary-background focus:bg-secondary-background"
                  onSelect={handleShare}
                >
                  その他の方法でポストを共有...
                </DropdownMenu.Item>
              </animated.div>
            </DropdownMenu.Content>
          ) : null,
        )}
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
