import type { naviItems } from "@/constants/navi-items";

export type NaviProps = {
  current: (typeof naviItems)[number]["title"];
};
