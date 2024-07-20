import { auth } from "@/lib/auth";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const route = app.get("/hello", async (c) => {
  const session = await auth();
  const name = session?.user?.name ?? "John Doe";
  return c.json({ name });
});

export const GET = handle(app);
export type AppType = typeof route;
