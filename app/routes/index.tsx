import { createRoute } from "honox/factory";
import Scanner from "../islands/scanner";

export default createRoute((c) => {
  return c.render(
    <div className="text-base text-red-800">
      <Scanner onReadCode={() => {}} />
    </div>,
    { title: "🐙" },
  );
});
