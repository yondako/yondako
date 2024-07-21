import { handlers } from "@/lib/auth.server";

export const runtime = "edge";
export const { GET, POST } = handlers;
