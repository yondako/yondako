"use client";

import IconBlubOff from "@/assets/icons/bulb-off.svg";
import IconBulb from "@/assets/icons/bulb.svg";
import BookDetail from "@/components/BookDetail";
import MobileHeader from "@/components/MobileHeader";
import { toast } from "@/components/Toast";
import type { BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import Quagga from "@ericblade/quagga2";
import { useCallback, useOptimistic, useReducer, useRef, useState } from "react";
import { searchFromIsbn } from "#actions/searchFromIsbn";
import MessagePage from "../MessagePage";
import ScannerCore from "./Core";

export default function Scanner() {
  const [isCameraError, setIsCameraError] = useState(false);
  const [searchResult, setSearchResult] = useState<BookType | null>(null);
  const [displayReadingStatus, setDisplayReadingStatus] = useState<ReadingStatus>("none");
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(displayReadingStatus);
  const [torchOn, toggleTorchOn] = useReducer((v) => !v, false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const isSearched = useRef(false);

  const handleDetected = useCallback(async (code: string) => {
    // ISBNではない or 検索済みならスキップ
    if (!code.startsWith("978") || isSearched.current) {
      return;
    }

    isSearched.current = true;
    const result = await searchFromIsbn(code);

    if (!result) {
      toast.error(
        "書籍がみつかりませんでした",
        {
          description: `ISBN: ${code}`,
        },
        {
          onDismiss: () => {
            isSearched.current = false;
          },
          onAutoClose: () => {
            isSearched.current = false;
          },
        },
      );

      return;
    }

    setSearchResult(result);
    setDisplayReadingStatus(result.readingStatus);
  }, []);

  const handleInitError = useCallback((err: unknown) => {
    console.error("InitError", err);
    setIsCameraError(true);
  }, []);

  // ライトのオン・オフ
  const handleTorchClick = useCallback(() => {
    const torch = !torchOn;

    toggleTorchOn();

    if (torch) {
      Quagga.CameraAccess.enableTorch();
    } else {
      Quagga.CameraAccess.disableTorch();
    }
  }, [torchOn]);

  if (isCameraError) {
    return (
      <MessagePage
        title="外カメラが起動できませんでした"
        decoration={
          <>
            <span className="absolute top-0 left-0 text-3xl">📷️</span>
            <span className="-right-8 absolute top-0 text-5xl">❓️</span>
          </>
        }
      >
        <p className="mx-4 mt-3">
          外カメラがお使いのデバイスにある場合は、ブラウザで使用を許可しているか設定をご確認ください
        </p>
      </MessagePage>
    );
  }

  const IconBlubStatus = torchOn ? IconBulb : IconBlubOff;

  return (
    <>
      <MobileHeader className="fixed inset-0 z-10 h-fit text-white" />
      <div className="relative h-svh w-screen bg-primary-background [&>video]:h-full" ref={scannerRef}>
        <div className="absolute inset-x-0 top-0 h-2/5 bg-black/40">
          <button className="absolute top-8 right-8 z-20 text-white" onClick={handleTorchClick}>
            <IconBlubStatus className="h-8 w-8" />
          </button>
          <div className="absolute bottom-8 w-full text-center text-white">
            <p>書籍のバーコードを映してください</p>
            <p>(数字が 978 で始まるもの)</p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-black/40" />

        <canvas
          className="drawingBuffer" // これがないと Quagga に認識されない
          style={{ position: "absolute" }}
        />
        <ScannerCore scannerRef={scannerRef} onDetected={handleDetected} onInitError={handleInitError} />
      </div>

      {searchResult && (
        <BookDetail
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setSearchResult(null);
              isSearched.current = false;
            }
          }}
          bookDetailProps={{
            data: searchResult,
            status: displayReadingStatus,
            onChangeStatus: (status) => setDisplayReadingStatus(status),
            optimisticStatus,
            onChangeOptimisticStatus: (status) => addOptimisticStatus(status),
          }}
        />
      )}
    </>
  );
}
