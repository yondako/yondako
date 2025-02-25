import { picklist } from "valibot";

export const NDCList = [
  {
    label: "雑誌",
    value: "005",
  },
  {
    label: "漫画",
    value: "726.1",
  },
  {
    label: "近代小説 (日本)",
    value: "913.6",
  },
  {
    label: "エッセイ (日本)",
    value: "914.6",
  },
] as const;

export type NDC = (typeof NDCList)[number]["value"];

export const ndcSchema = picklist(NDCList.map((ndc) => ndc.value));
