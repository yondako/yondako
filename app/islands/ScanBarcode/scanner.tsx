import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { Result } from "@zxing/library";
import { useEffect, useMemo, useRef } from "react";

type Props = {
  onReadCode: (result: Result) => void;
};

/**
 * 参考:
 * - https://stak.tech/news/14668
 * - https://zenn.dev/terrierscript/articles/2020-12-22-zxing-browser-react-qr-code-reader
 */
export default function Scanner({ onReadCode }: Props) {
  const ctrlRef = useRef<IScannerControls | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useMemo(() => new BrowserMultiFormatReader(), []);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    reader.decodeFromVideoDevice(
      undefined, // 背面カメラを優先
      videoRef.current,
      (result, error, ctrl) => {
        if (!result) {
          return;
        }

        if (error) {
          console.error("[Scanner Error]", error);
          return;
        }

        onReadCode(result);
        ctrlRef.current = ctrl;
      },
    );

    return () => {
      if (!ctrlRef.current) {
        return;
      }

      ctrlRef.current.stop();
      ctrlRef.current = null;
    };
  }, [reader, onReadCode]);

  // biome-ignore lint/a11y/useMediaCaption: <explanation>
  return <video className="w-full h-64 overflow-hidden" ref={videoRef} />;
}
