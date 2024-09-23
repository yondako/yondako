"use client";

import logoUrl from "@/assets/images/logo/portrait.svg?url";
import Footer from "@/components/Footer";
import { naviItems } from "@/constants/navi-items";
import { site } from "@/constants/site";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import Item from "./Item";

export default function SideNavi({
  className,
  ...props
}: ComponentPropsWithoutRef<"nav">) {
  const segments = useSelectedLayoutSegments().join("/");

  return (
    <nav
      {...props}
      className={twMerge(
        "flex h-full w-full max-w-60 flex-col justify-between",
        className,
      )}
    >
      <div className="mt-8">
        <Link className="ml-8 block w-32" href="/">
          <Image src={logoUrl} alt={site.name} priority />
          <p className="text-accent text-xs">ver.beta</p>
        </Link>

        <div className="mt-6 space-y-2">
          {naviItems.map(({ matchSegmentsRegExp, ...item }) => (
            <Item
              {...item}
              current={matchSegmentsRegExp.test(segments)}
              key={item.title}
            />
          ))}
        </div>
      </div>

      <Footer className="mt-auto p-8" portrait />
    </nav>
  );
}
