import { reactRenderer } from "@hono/react-renderer";
import { site } from "../libs/constants";

export default reactRenderer(({ children, title }) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href={
            import.meta.env.PROD ? "/static/assets/style.css" : "/app/style.css"
          }
          rel="stylesheet"
        />
        <script
          type="module"
          src={import.meta.env.PROD ? "/static/client.js" : "/app/client.ts"}
        />
        <title>{title}</title>
        <meta name="description" content={site.description.long} />
        <meta property="og:url" content={site.url} />
        <meta property="og:title" content={site.name} />
        <meta property="og:description" content={site.description.long} />
        <meta property="twitter:url" content={site.url} />
        <meta property="twitter:title" content={site.name} />
        <meta property="twitter:description" content={site.description.long} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-background text-text">{children}</body>
    </html>
  );
});
