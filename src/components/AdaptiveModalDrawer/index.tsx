"use client";

import { useMedia } from "react-use";
import Drawer from "./Drawer";
import Modal from "./Modal";
import type { AdaptiveModalDrawerProps } from "./props";

export default function BookDetail(props: Omit<AdaptiveModalDrawerProps, "defaultOpen" | "modal">) {
  const isDesktopWidth = useMedia("(min-width: 64rem)", false); // Tailwind の lg と単位も揃える

  return isDesktopWidth ? <Modal {...props} /> : <Drawer {...props} />;
}
