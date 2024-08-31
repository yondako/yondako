"use client";

import IconBlubOff from "@/assets/icons/bulb-off.svg";
import IconBulb from "@/assets/icons/bulb.svg";
import BookDetail from "@/components/BookDetail";
import type { BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import Quagga from "@ericblade/quagga2";
import {
  useCallback,
  useEffect,
  useOptimistic,
  useReducer,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { searchFromIsbn } from "../../_actions/searchFromIsbn";
import CameraError from "../CameraError";
import { useScanner } from "./useScanner";

export default function Scanner() {
  const [isCameraError, setIsCameraError] = useState(false);
  const [searchResult, setSearchResult] = useState<BookType | null>(null);
  const [displayReadingStatus, setDisplayReadingStatus] =
    useState<ReadingStatus>("none");
  const [optimisticStatus, addOptimisticStatus] =
    useOptimistic(displayReadingStatus);
  const [torchOn, toggleTorchOn] = useReducer((v) => !v, false);
  const isSearched = useRef(false);

  const handleDetected = useCallback(async (code: string) => {
    // ISBNではない or 検索済みならスキップ
    if (!code.startsWith("978") || isSearched.current) {
      return;
    }

    isSearched.current = true;
    console.log("searching");
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
    setDisplayReadingStatus(result.readingStatus);
  }, []);

  const handleInitError = useCallback((err: unknown) => {
    console.error("InitError", err);
    setIsCameraError(true);
  }, []);

  const scannerRef = useScanner({
    onDetected: handleDetected,
    onInitError: handleInitError,
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
      .then(() => Quagga.CameraAccess.disableTorch())
      .catch((err) => {
        console.error("CameraError", err);
        setIsCameraError(true);
      });

    return () => {
      disableCamera();
    };
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
    return <CameraError />;
  }

  const IconBlubStatus = torchOn ? IconBulb : IconBlubOff;

  return (
    <>
      <div
        className="relative h-full bg-primary-background [&>video]:h-full"
        ref={scannerRef}
      >
        <div className="absolute inset-x-0 top-0 h-2/5 bg-black/40">
          <button
            className="absolute top-8 right-8 z-20 text-white"
            onClick={handleTorchClick}
          >
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
