"use client";

import { useMedia } from "react-use";
import Drawer from "./Drawer";
import Modal from "./Modal";
import type { AdaptiveModalDrawerProps } from "./props";

export default function BookDetail(props: Omit<AdaptiveModalDrawerProps, "defaultOpen" | "modal">) {
  const isDesktopWidth = useMedia("(min-width: 1024px)", false); // Tailwind の lg 幅

  return isDesktopWidth ? <Modal {...props} /> : <Drawer {...props} />;
}
