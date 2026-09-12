/*
The MIT License (MIT)

Copyright (c) 2023 Eric Blade ( blade.eric@gmail.com https://www.github.com/ericblade ) and all other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

repo: https://github.com/ericblade/quagga2-react-example
*/

import Quagga, { type QuaggaJSResultObject } from "@ericblade/quagga2";
import { type RefObject, useCallback, useLayoutEffect, useRef } from "react";
import { enableContinuousAutofocus, rememberCamera, selectCamera } from "./camera";

export type CameraState = { devices: MediaDeviceInfo[]; deviceId: string; torch: boolean };

// Quagga は単一インスタンスなので、停止直後の再起動も前回の初期化完了を待つ。
let initialization = Promise.resolve();

type Props = {
  scannerRef: RefObject<HTMLDivElement | null>;
  deviceId?: string;
  onReady?: (camera: CameraState) => void;

  /**
   * バーコードを検出した
   * @param code 検出したコード
   */
  onDetected: (code: string) => void;
  /**
   * 初期化時にエラーが発生した
   * @param err エラー
   */
  onInitError: (err: unknown) => void;
};

/**
 * 中央値を取得
 * @param arr 配列
 * @returns 中央値
 */
function getMedian(arr: number[]): number {
  const newArr = [...arr];
  newArr.sort((a, b) => a - b);

  const half = Math.floor(newArr.length / 2);
  if (newArr.length % 2 === 1) {
    return newArr[half];
  }

  return (newArr[half - 1] + newArr[half]) / 2;
}

/**
 * NOTE:
 * Custom Hooks にしたらなんかトーチの制御がうまくいかなくなったので、サンプル通りコンポーネントにしてる
 * 具体的には1回目のトーチのON時に Operation Error: The associated Track is in an invalid state. が発生する
 */
export default function ScannerCore({ scannerRef, deviceId = "", onDetected, onInitError, onReady }: Props) {
  const prevScanCode = useRef("");
  const rememberedCamera = useRef(false);

  const checkError = useCallback(
    (result: QuaggaJSResultObject) => {
      const { code, decodedCodes } = result.codeResult;

      const errors = decodedCodes.flatMap((x) => x.error).filter((x) => typeof x === "number");

      const medianOfErrors = getMedian(errors);

      // コードが無い or 精度がしきい値未満
      if (!code || medianOfErrors > 0.25) {
        return;
      }

      // 2回同じコードを検出したら、検出成功とみなす
      if (code === prevScanCode.current) {
        if (!rememberedCamera.current && code.startsWith("978")) {
          const activeId = Quagga.CameraAccess.getActiveTrack()?.getSettings().deviceId;
          if (activeId) {
            rememberCamera(activeId);
            rememberedCamera.current = true;
          }
        }
        onDetected(code);
      } else {
        prevScanCode.current = code;
      }
    },
    [onDetected],
  );

  useLayoutEffect(() => {
    const controller = new AbortController();
    let started = false;
    prevScanCode.current = "";
    rememberedCamera.current = false;

    const timer = setTimeout(() => {
      initialization = initialization.then(async () => {
        if (controller.signal.aborted) return;
        try {
          const selected = await selectCamera(deviceId, controller.signal);
          if (controller.signal.aborted) return;
          const isLandscape =
            screen.orientation?.type?.startsWith("landscape") ?? window.innerWidth > window.innerHeight;
          await new Promise<void>((resolve, reject) => {
            Promise.resolve(
              Quagga.init(
                {
                  inputStream: {
                    type: "LiveStream",
                    constraints: {
                      ...(selected.deviceId
                        ? { deviceId: { exact: selected.deviceId } }
                        : { facingMode: { exact: "environment" } }),
                      width: isLandscape ? window.innerWidth : window.innerHeight,
                      height: isLandscape ? window.innerHeight : window.innerWidth,
                    },
                    area: { top: "40%", right: "0%", left: "0%", bottom: "40%" },
                    target: scannerRef.current ?? undefined,
                    willReadFrequently: true,
                  },
                  locator: { patchSize: "large", halfSample: true, willReadFrequently: true },
                  decoder: { readers: ["ean_reader"], multiple: false },
                  locate: false,
                },
                (error) => (error ? reject(error) : resolve()),
              ),
            ).catch(reject);
          });

          if (controller.signal.aborted) {
            await Quagga.stop();
            return;
          }
          const track = Quagga.CameraAccess.getActiveTrack();
          if (!track) throw new Error("カメラの映像を取得できませんでした");
          await enableContinuousAutofocus(track);
          let devices: MediaDeviceInfo[] = [];
          try {
            devices = (await navigator.mediaDevices.enumerateDevices()).filter(
              (device) => device.kind === "videoinput" && Boolean(device.deviceId),
            );
          } catch {
            // 一覧取得に失敗しても、既に起動できたカメラで読み取りを続ける。
          }
          if (controller.signal.aborted) {
            await Quagga.stop();
            return;
          }
          const activeId = track.getSettings().deviceId ?? selected.deviceId;
          Quagga.onDetected(checkError);
          Quagga.start();
          started = true;
          if (deviceId && activeId) rememberCamera(activeId);
          onReady?.({
            devices,
            deviceId: activeId,
            torch:
              (track.getCapabilities?.() as (MediaTrackCapabilities & { torch?: boolean }) | undefined)?.torch === true,
          });
        } catch (error) {
          Quagga.offDetected(checkError);
          await Quagga.stop();
          if (!controller.signal.aborted) onInitError(error);
        }
      });
    }, 1);

    return () => {
      controller.abort();
      clearTimeout(timer);
      Quagga.offDetected(checkError);
      if (started) {
        initialization = initialization
          .then(() => Quagga.stop())
          .catch((error) => {
            console.warn("CameraStopError", error);
          });
      }
    };
  }, [checkError, scannerRef, deviceId, onInitError, onReady]);

  return null;
}
