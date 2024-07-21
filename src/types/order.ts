import { picklist } from "valibot";

export type Order = "asc" | "desc";

export const orderSchema = picklist(["asc", "desc"]);
