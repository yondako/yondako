"use client";

import Quagga from "@ericblade/quagga2";
import { useEffect } from "react";
import { useWindowSize } from "react-use";
import { useScanner } from "./useScanner";

/**
 * TODO:
 * - [ ] デスクトップからは開けないように。スマホのみ対応しています！って出す
 * - [ ] スマホが横向きの場合、縦にしてくださいって出す
 */

export default function Scanner() {
  const { width, height } = useWindowSize();

  const scannerRef = useScanner({
    width,
    height,
    landscape: false,
    onDetected: (result) => {
      if (!result.startsWith("978")) {
        console.log("ISBNのバーコードではありません！");
        return;
      }

      console.log("Detected", result);
    },
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
        console.error("camera", err);
      });

    return () => {
      disableCamera();
    };
  }, []);

  return (
    <div
      className="relative bg-red-500"
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
    </div>
  );
}
