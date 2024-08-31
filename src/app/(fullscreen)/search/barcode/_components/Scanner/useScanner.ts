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

import type { QuaggaJSResultCallbackFunction } from "@ericblade/quagga2";
import Quagga from "@ericblade/quagga2";
import { useCallback, useLayoutEffect, useRef } from "react";

type Props = {
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

export const useScanner = ({ onDetected, onInitError }: Props) => {
  const prevScanCode = useRef("");
  const scannerRef = useRef<HTMLDivElement>(null);

  const checkError = useCallback<QuaggaJSResultCallbackFunction>(
    (result) => {
      const { code, decodedCodes } = result.codeResult;

      const errors = decodedCodes
        .flatMap((x) => x.error)
        .filter((x) => typeof x === "number");

      const medianOfErrors = getMedian(errors);

      // コードが無い or 精度がしきい値未満
      if (!code || medianOfErrors > 0.25) {
        return;
      }

      // 2回同じコードを検出したら、検出成功とみなす
      if (code === prevScanCode.current) {
        onDetected(code);
      } else {
        prevScanCode.current = code;
      }
    },
    [onDetected],
  );

  // 初期化
  useLayoutEffect(() => {
    let ignoreStart = false;

    const init = async () => {
      // HACK: initが連続して複数回呼ばれないようにするため
      await new Promise((resolve) => setTimeout(resolve, 1));

      if (ignoreStart) {
        return;
      }

      const isLandscape =
        screen.orientation.type === "landscape-primary" ||
        screen.orientation.type === "landscape-secondary";

      // getUserMedia API で取得できるサイズは横向きの場合の値らしいので入れ替える
      const constraintsWidth = isLandscape
        ? window.innerWidth
        : window.innerHeight;
      const constraintsHeight = isLandscape
        ? window.innerHeight
        : window.innerWidth;

      console.log(constraintsWidth, constraintsHeight);

      await Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              facingMode: {
                exact: "environment",
              },
              width: constraintsWidth,
              height: constraintsHeight,
            },
            area: {
              top: "40%",
              right: "0%",
              left: "0%",
              bottom: "40%",
            },
            target: scannerRef.current ?? undefined,
            willReadFrequently: true,
          },
          locator: {
            patchSize: "large",
            halfSample: true,
            willReadFrequently: true,
          },
          decoder: {
            readers: ["ean_reader"],
            multiple: false,
          },
          locate: false,
        },
        async (err) => {
          // 初期化失敗
          if (err) {
            onInitError(err);
            return;
          }

          if (scannerRef.current) {
            Quagga.start();
          }
        },
      );

      Quagga.onDetected(checkError);
    };

    init();

    return () => {
      ignoreStart = true;
      Quagga.stop();
      Quagga.offDetected(checkError);
    };
  }, [checkError, onInitError]);

  return scannerRef;
};
