"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useOrientation } from "react-use";

const Scanner = dynamic(() => import("../Scanner"), {
  ssr: false,
});

export default function Preparation() {
  const [scanning, setScanning] = useState(true);
  const { type } = useOrientation();

  // 画面が回転したらカメラのサイズを変更する必要があるので、最初からやり直す
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // setScanning(false);
  }, [type]);

  return scanning ? (
    <Scanner />
  ) : (
    <button
      className="mt-32 bg-red-500 text-5xl"
      onClick={() => {
        setScanning(true);
      }}
    >
      start!
    </button>
  );
}
