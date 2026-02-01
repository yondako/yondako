import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { animated, useTransition } from "@react-spring/web";
import { type PropsWithChildren, useState } from "react";
import { toast } from "@/components/Toast";
import { useDevice } from "@/contexts/DeviceContext";

export type ShareDropdownMenuProps = PropsWithChildren<{
  ndlUrl: string;
  bookTitle?: string;
}>;

export default function ShareDropdownMenu({ children, ndlUrl, bookTitle }: ShareDropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const { isDesktop } = useDevice();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ndlUrl);
      toast.success("リンクをコピーしました", {
        emoji: "📋",
        description: bookTitle,
      });
    } catch {
      toast.error("リンクのコピーに失敗しました", {
        emoji: "⚠️",
        description: "クリップボードへのアクセスが許可されているか設定をご確認ください",
      });
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

  const itemClassName =
    "flex cursor-pointer rounded-xl select-none items-center px-4 py-3 text-primary-foreground text-sm outline-none transition hover:brightness-95 bg-primary-background";

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
                className="origin-top overflow-hidden rounded-2xl bg-primary-background p-2 shadow-lg"
                style={style}
              >
                <DropdownMenu.Item className={itemClassName} onSelect={handleCopyLink}>
                  リンクをコピー
                </DropdownMenu.Item>
                <DropdownMenu.Item className={itemClassName} onSelect={handleShare}>
                  その他の方法で共有
                </DropdownMenu.Item>
              </animated.div>
            </DropdownMenu.Content>
          ) : null,
        )}
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
