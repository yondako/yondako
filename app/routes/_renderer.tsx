import { reactRenderer } from "@hono/react-renderer";
import { site } from "../libs/constants";

export default reactRenderer(({ children, title }) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {import.meta.env.PROD ? (
          <link href="static/assets/style.css" rel="stylesheet" />
        ) : (
          <link href="/app/style.css" rel="stylesheet" />
        )}
        {import.meta.env.PROD ? (
          <script type="module" src="/static/client.js" />
        ) : (
          <script type="module" src="/app/client.ts" />
        )}
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
      <body>{children}</body>
    </html>
  );
});
