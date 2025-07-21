"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import ImageLogo from "@/assets/images/logo/portrait.svg";
import Footer from "@/components/Footer";
import { naviItems } from "@/constants/navi-items";
import { site } from "@/constants/site";
import { useCheckLatestNews } from "@/hooks/useCheckLatestNews";
import { useLatestNews } from "@/hooks/useLatestNews";
import Item from "./Item";

/**
 * サイドナビゲーションコンポーネント
 * アクティブページのハイライト表示とバッジ通知機能を含みます。
 */
export default function SideNavi({ className, ...props }: ComponentPropsWithoutRef<"nav">) {
  const segments = useSelectedLayoutSegments().join("/");
  const { latestNewsTimestamp } = useLatestNews();
  const hasNewNews = useCheckLatestNews(latestNewsTimestamp);

  return (
    <nav {...props} className={twMerge("flex h-full w-full max-w-60 flex-col justify-between", className)}>
      <div className="mt-8">
        <Link className="ml-8 block w-32" href="/">
          <ImageLogo aria-label={site.name} />
        </Link>

        <div className="mt-7 space-y-2">
          {naviItems.map(({ matchSegmentsRegExp, ...item }) => {
            const badge = item.title === "お知らせ" && hasNewNews;

            return <Item {...item} key={item.title} current={matchSegmentsRegExp.test(segments)} badge={badge} />;
          })}
        </div>
      </div>

      <Footer className="mt-auto p-8" portrait />
    </nav>
  );
}
