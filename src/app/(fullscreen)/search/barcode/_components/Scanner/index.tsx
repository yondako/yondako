"use client";

import Quagga from "@ericblade/quagga2";
import { useCallback, useOptimistic, useRef, useState } from "react";
import { searchFromIsbn } from "#actions/searchFromIsbn";
import IconBulb from "@/assets/icons/bulb.svg";
import IconBlubOff from "@/assets/icons/bulb-off.svg";
import BookDetail from "@/components/BookDetail";
import Button from "@/components/Button";
import MobileHeader from "@/components/MobileHeader";
import Select from "@/components/Select";
import { toast } from "@/components/Toast";
import type { BookType } from "@/types/book";
import type { ReadingStatus } from "@/types/readingStatus";
import MessagePage from "../MessagePage";
import ScannerCore, { type CameraState } from "./Core";

export default function Scanner() {
  const [isCameraError, setIsCameraError] = useState(false);
  const [searchResult, setSearchResult] = useState<BookType | null>(null);
  const [displayReadingStatus, setDisplayReadingStatus] = useState<ReadingStatus>("none");
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(displayReadingStatus);
  const [torchOn, setTorchOn] = useState(false);
  const [torchBusy, setTorchBusy] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [camera, setCamera] = useState<CameraState | null>(null);
  const [deviceId, setDeviceId] = useState("");
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
          emoji: "🫥",
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

  const handleReady = useCallback((state: CameraState) => {
    setCamera(state);
    setTorchOn(false);
    setCameraReady(true);
  }, []);

  // ライトのオン・オフ
  const handleTorchClick = useCallback(async () => {
    if (!cameraReady || torchBusy) return;
    const torch = !torchOn;
    setTorchBusy(true);
    try {
      if (torch) await Quagga.CameraAccess.enableTorch();
      else await Quagga.CameraAccess.disableTorch();
      setTorchOn(torch);
    } catch (error) {
      console.error("TorchError", error);
      toast.error("ライトを切り替えられませんでした");
    } finally {
      setTorchBusy(false);
    }
  }, [torchOn, cameraReady, torchBusy]);

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
        <Button
          variant="accent"
          className="mt-4"
          onClick={() => {
            setDeviceId("");
            setCameraReady(false);
            setTorchOn(false);
            setIsCameraError(false);
          }}
        >
          カメラを選び直す
        </Button>
      </MessagePage>
    );
  }

  const IconBlubStatus = torchOn ? IconBulb : IconBlubOff;

  return (
    <>
      <MobileHeader className="fixed inset-0 z-10 h-fit text-white" />
      <div className="relative h-svh w-screen bg-primary-background [&>video]:h-full" ref={scannerRef}>
        <video muted autoPlay playsInline />
        <div className="absolute inset-x-0 top-0 h-2/5 bg-black/40">
          <button
            className="absolute top-8 right-8 z-20 text-white disabled:opacity-40"
            disabled={!cameraReady || !camera?.torch || torchBusy}
            aria-label={torchOn ? "ライトを消す" : "ライトをつける"}
            aria-pressed={torchOn}
            onClick={handleTorchClick}
          >
            <IconBlubStatus className="h-8 w-8" />
          </button>
          <div className="absolute bottom-8 w-full text-center text-white">
            <output className="block">
              {cameraReady ? "書籍のバーコードを映してください" : "カメラを準備しています…"}
            </output>
            <p>{cameraReady ? "(数字が 978 で始まるもの)" : "(ちょっとまってね)"}</p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-black/40">
          {camera && camera.devices.length > 1 && (
            // biome-ignore lint/a11y/noLabelWithoutControl: Select は内部で select 要素を描画する。
            <label className="absolute inset-x-8 bottom-28 z-10 flex flex-col gap-2 text-center text-sm text-white">
              読み取りにくいときはカメラを切り替えてください
              <Select
                aria-label="使用するカメラ"
                value={deviceId}
                disabled={!cameraReady || torchBusy}
                onChange={(event) => {
                  setCameraReady(false);
                  setTorchOn(false);
                  setDeviceId(event.target.value);
                }}
              >
                <option value="">自動選択（前回のカメラを優先）</option>
                {camera.devices.map((device, index) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `カメラ ${index + 1}`}
                  </option>
                ))}
              </Select>
            </label>
          )}
        </div>

        <canvas
          className="drawingBuffer" // これがないと Quagga に認識されない
          style={{ position: "absolute" }}
        />
        <ScannerCore
          scannerRef={scannerRef}
          deviceId={deviceId}
          onDetected={handleDetected}
          onInitError={handleInitError}
          onReady={handleReady}
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
