"use client";

import IconChevronLeft from "@/assets/icons/chevron-left.svg";
import IconChevronRight from "@/assets/icons/chevron-right.svg";
import IconChevronsLeft from "@/assets/icons/chevrons-left.svg";
import IconChevronsRight from "@/assets/icons/chevrons-right.svg";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  currentPage: number;
  totalPage: number;
  className?: string;
};

export default function Pagination({
  currentPage,
  totalPage,
  className,
}: Props) {
  const prevPageIndex = currentPage - 1;
  const nextPageIndex = currentPage + 1;

  return (
    <div
      className={twMerge(
        "flex items-center justify-center space-x-2 text-sm",
        className,
      )}
    >
      {currentPage !== 1 && (
        <LinkButton page={1}>
          <IconChevronsLeft className="h-5" />
        </LinkButton>
      )}

      {prevPageIndex >= 1 && (
        <LinkButton page={prevPageIndex}>
          <IconChevronLeft className="h-5" />
        </LinkButton>
      )}

      {new Array(totalPage).fill(0).map((_, i) => {
        const pageIndex = i + 1;

        if (
          (pageIndex >= currentPage - 1 && pageIndex <= currentPage + 1) ||
          (currentPage === 1 && pageIndex <= 3) ||
          (currentPage === totalPage && pageIndex >= totalPage - 2)
        ) {
          return (
            <LinkButton
              key={pageIndex}
              page={pageIndex}
              current={pageIndex === currentPage}
            >
              {pageIndex}
            </LinkButton>
          );
        }

        return null;
      })}

      {nextPageIndex <= totalPage && (
        <LinkButton page={nextPageIndex}>
          <IconChevronRight className="h-5" />
        </LinkButton>
      )}

      {currentPage !== totalPage && (
        <LinkButton page={totalPage}>
          <IconChevronsRight className="h-5" />
        </LinkButton>
      )}
    </div>
  );
}

type LinkButtonProps = {
  page: number;
  children: ReactNode;
  current?: boolean;
};

function LinkButton({ page, children, current = false }: LinkButtonProps) {
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());
  params.set("page", page.toString());

  return (
    <Link
      className={twMerge(
        "relative h-8 w-8 rounded-full bg-card transition hover:brightness-95",
        current && "bg-tako text-white",
      )}
      href={{
        query: params.toString(),
      }}
    >
      <span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
        {children}
      </span>
    </Link>
  );
}
