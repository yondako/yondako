"use client";

import BookDrawer from "@/components/BookDrawer";
import type { BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import Quagga from "@ericblade/quagga2";
import { useCallback, useEffect, useOptimistic, useRef, useState } from "react";
import { useWindowSize } from "react-use";
import { toast } from "sonner";
import { searchFromIsbn } from "../../_actions/searchFromIsbn";
import { useScanner } from "./useScanner";

/**
 * TODO:
 * - [ ] カメラの権限を要求する表示
 * - [ ] デスクトップからは開けないように。スマホのみ対応しています！って出す
 * - [ ] スマホが横向きの場合、縦にしてくださいって出す
 */

export default function Scanner() {
  const [searchResult, setSearchResult] = useState<BookType | null>(null);
  const [displayReadingStatus, setDisplayReadingStatus] =
    useState<ReadingStatus>(searchResult?.readingStatus ?? "none");
  const [optimisticStatus, addOptimisticStatus] =
    useOptimistic(displayReadingStatus);
  const isSearched = useRef(false);

  const { width, height } = useWindowSize();

  const handleDetected = useCallback(async (code: string) => {
    // ISBNではない or 検索済みならスキップ
    if (!code.startsWith("978") || isSearched.current) {
      return;
    }

    isSearched.current = true;
    const result = await searchFromIsbn(code);

    if (!result) {
      toast.info("書籍がみつかりませんでした", {
        description: `ISBN: ${code}`,
        onDismiss: () => {
          isSearched.current = false;
        },
        onAutoClose: () => {
          isSearched.current = false;
        },
      });

      return;
    }

    setSearchResult(result);
  }, []);

  const scannerRef = useScanner({
    width,
    height,
    landscape: false,
    onDetected: handleDetected,
  });

  // 権限を取得
  useEffect(() => {
    const enableCamera = async () => {
      await Quagga.CameraAccess.request(null, {});
    };

    const disableCamera = async () => {
      await Quagga.CameraAccess.release();
    };

    enableCamera()
      .then(disableCamera)
      .catch((err) => {
        // TODO: カメラの権限不足
        console.error("camera", err);
      });

    return () => {
      disableCamera();
    };
  }, []);

  return (
    <div
      className="relative bg-primary-background"
      style={{ width, height }}
      ref={scannerRef}
    >
      <div className="absolute inset-x-0 top-0 h-2/5 bg-black/40">
        <div className="absolute bottom-8 w-full text-center text-white">
          <p>書籍のバーコードを映してください</p>
          <p>(数字が 978 で始まるもの)</p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-black/40" />

      <canvas
        className="drawingBuffer" // これがないと Quagga に認識されない
        style={{ position: "absolute" }}
        width={width}
        height={height}
      />

      {searchResult && (
        <BookDrawer
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setSearchResult(null);
              isSearched.current = false;
            }
          }}
          data={searchResult}
          status={displayReadingStatus}
          onChangeStatus={(status) => setDisplayReadingStatus(status)}
          optimisticStatus={optimisticStatus}
          onChangeOptimisticStatus={(status) => addOptimisticStatus(status)}
        />
      )}
    </div>
  );
}
