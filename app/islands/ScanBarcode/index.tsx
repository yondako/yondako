import { Result } from "@zxing/library";
import Scanner from "./scanner";
import { useState } from "react";

export default function ScanBarcode() {
  const [isbn, setIsbn] = useState("");

  const handleReadCode = (result: Result) => {
    setIsbn(result.getText());
  };

  return (
    <div>
      <Scanner onReadCode={handleReadCode} />
      <p className="mt-4">{isbn}</p>
    </div>
  );
}
