import { reactRenderer } from "@hono/react-renderer";

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
			</head>
			<body>{children}</body>
		</html>
	);
});
