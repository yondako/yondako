import { createRoute } from "honox/factory";
import ScanBarcode from "../islands/ScanBarcode";

export default createRoute((c) => {
  return c.render(
    <div className="text-base text-red-800">
      <ScanBarcode />
    </div>,
    { title: "🐙" },
  );
});
