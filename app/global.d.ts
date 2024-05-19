import "@hono/react-renderer";

declare module "hono" {
  interface Env {
    Bindings: {
      DB: D1Database;
    };
  }
}

declare module "@hono/react-renderer" {
  interface Props {
    title: string;
  }
}
