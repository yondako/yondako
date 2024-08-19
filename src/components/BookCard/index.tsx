"use client";

import { updateReadingStatus } from "@/actions/updateReadingStatus";
import IconDotsVertical from "@/assets/icons/dots-vertical.svg";
import { readingStatusMetadata } from "@/constants/status";
import type { BookType } from "@/types/book";
import { useOptimistic, useState } from "react";
import { toast } from "sonner";
import Detail from "./Detail";
import ReadingStatusButton, { readingStatusOrder } from "./ReadingStatusButton";
import { BookThumbnail } from "./Thumbnail";

export type BookCardProps = {
  data: BookType;
  hideReadingStatusBadge?: boolean;
};

export default function BookCard({ data }: BookCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [displayReadingStatus, setDisplayReadingStatus] = useState(
    data.readingStatus,
  );
  const [optimisticStatus, addOptimisticStatus] =
    useOptimistic(displayReadingStatus);

  // 読書ステータスが変更された
  const changeStatusFormAction = async (formData: FormData) => {
    const newStatus = formData.get("status") as BookType["readingStatus"];

    addOptimisticStatus(newStatus);

    const result = await updateReadingStatus(data.detail.ndlBibId, newStatus);

    // 記録に失敗
    if (result.error || !result.book) {
      toast.error("記録に失敗しました", {
        description: (
          <p>
            {result.error}
            <br />
            {data.detail.title}
          </p>
        ),
      });

      addOptimisticStatus(data.readingStatus);
      return;
    }

    setDisplayReadingStatus(result.book.readingStatus);
  };

  return (
    <div className="relative w-full text-left text-text">
      <div className="mt-8 flex h-40 w-full flex-col justify-between overflow-hidden rounded-2xl bg-card p-4 pl-36">
        {data.detail.isbn && showDetail ? (
          <Detail
            rawIsbn={data.detail.isbn}
            open={showDetail}
            onChangeOpen={setShowDetail}
          />
        ) : (
          <>
            <div className="space-y-1">
              <p className="line-clamp-3 font-bold text-sm leading-5">
                {data.detail.title}
              </p>

              {data.detail.authors && (
                <p className="line-clamp-1 text-text-sub text-xxs">
                  {data.detail.authors.join(", ")}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <form
                className="flex w-full justify-start text-tako"
                action={changeStatusFormAction}
              >
                {readingStatusOrder.map((status) => {
                  const meta = readingStatusMetadata.get(status);

                  return meta ? (
                    <ReadingStatusButton
                      status={status}
                      meta={meta}
                      selected={optimisticStatus === status}
                      key={status}
                    />
                  ) : null;
                })}
              </form>

              {data.detail.isbn && (
                <button
                  className="rounded-2xl bg-card p-1 transition hover:brightness-95"
                  onClick={() => {
                    setShowDetail(true);
                  }}
                >
                  <IconDotsVertical className="h-4 w-4" />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <BookThumbnail
        className="absolute top-4 left-4 w-28"
        src={data.detail.thumbnailUrl}
      />
    </div>
  );
}
