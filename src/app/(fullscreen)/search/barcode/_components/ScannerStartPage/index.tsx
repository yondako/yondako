"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useOrientation } from "react-use";
import IconScan from "@/assets/icons/scan.svg";
import Button from "@/components/Button";
import MessagePage from "../MessagePage";

const Scanner = dynamic(() => import("../Scanner"), {
  ssr: false,
});

export default function ScannerStartPage() {
  const [scanning, setScanning] = useState(false);
  const { type } = useOrientation();

  // 画面が回転したらカメラのサイズを変更する必要があるので、最初からやり直す
  // biome-ignore lint/correctness/useExhaustiveDependencies: typeの変更時のみスキャン状態をリセットする
  useEffect(() => {
    setScanning(false);
  }, [type]);

  return (
    <>
      {scanning ? (
        <Scanner />
      ) : (
        <MessagePage
          title="書籍のバーコードから検索"
          decoration={
            <>
              <span className="absolute top-0 left-0 text-3xl">📸</span>
              <span className="absolute top-1 right-2 text-3xl">🔍️</span>
            </>
          }
        >
          <p className="mt-1 text-secondary-foreground">紙の書籍を簡単に追加できます！</p>
          <Button
            className="mt-6 flex w-full items-center justify-center space-x-2 text-sm"
            variant="accent"
            onClick={() => {
              setScanning(true);
            }}
          >
            <IconScan className="h-5 w-5" />
            <span>カメラを起動する</span>
          </Button>
        </MessagePage>
      )}
    </>
  );
}
