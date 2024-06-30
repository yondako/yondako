import logoUrl from "@/assets/images/logo_portrait.svg";
import LandingLayout from "@/components/landing/Layout";
import { site } from "@/constants/site";
import LoginButton from "@/islands/LoginButton";
import GitHub from "@auth/core/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

const app = new Hono();

app.use(
  "*",
  initAuthConfig((c) => {
    return {
      adapter: DrizzleAdapter(drizzle(c.env.DB)),
      secret: c.env.AUTH_SECRET,
      providers: [
        GitHub({
          clientId: c.env.GITHUB_ID,
          clientSecret: c.env.GITHUB_SECRET,
        }),
      ],
    };
  }),
);

app.use("/api/auth/*", authHandler());

app.get("/", async (c) => {
  return c.render(
    <LandingLayout>
      <div className="max-w-none md:max-w-[60vw] mt-auto md:my-auto">
        <img
          className="mx-auto md:mx-0"
          width={256}
          src={logoUrl}
          alt={site.name}
        />
        <h1 className="mt-12 text-3xl md:text-4xl tracking-wide text-center md:text-left">
          {site.description.short}
        </h1>
        <p className="mt-6 text-center md:text-left">{site.description.long}</p>
        <LoginButton />
      </div>
    </LandingLayout>,
    {
      title: `${site.name} | ${site.description.short}`,
    },
  );
});

app.use("*", verifyAuth());

export default app;
