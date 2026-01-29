import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-links", "storybook-addon-pseudo-states", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/nextjs",
    options: {
      bundler: {
        useSWC: true,
      },
    },
  },
  features: {
    experimentalRSC: true,
  },
  staticDirs: [
    "../public",
    {
      from: "../src/assets/fonts",
      to: "src/assets/fonts",
    },
  ],
  webpackFinal: async (config) => {
    // package.json の imports フィールドで "storybook" 条件を使えるようにする
    config.resolve = config.resolve || {};
    config.resolve.conditionNames = [
      "storybook",
      ...(config.resolve.conditionNames || ["require", "module", "import"]),
    ];
    // # で始まるインポート（imports フィールド）を解決する
    config.resolve.importsFields = ["imports"];

    // Node.js 専用パッケージを Storybook 用のモックに置き換える
    config.resolve.alias = {
      ...config.resolve.alias,
      "better-auth$": path.resolve(__dirname, "./mocks/better-auth.ts"),
      "better-auth/react": path.resolve(__dirname, "./mocks/better-auth.ts"),
      "@opennextjs/cloudflare": path.resolve(__dirname, "./mocks/opennextjs-cloudflare.ts"),
    };

    // node: スキームのモジュールを外部化（@opennextjs/cloudflareなどが使用）
    const existingExternals = config.externals || [];
    config.externals = [
      ...(Array.isArray(existingExternals) ? existingExternals : [existingExternals]),
      ({ request }: { request?: string }, callback: (err?: null, result?: string) => void) => {
        if (request && /^node:/.test(request)) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      },
    ];

    const fileLoaderRule = config.module?.rules?.find(
      (rule) => (rule as { test?: RegExp })?.test?.test(".svg"),
      // biome-ignore lint/suspicious/noExplicitAny: webpackの設定オブジェクトは動的な構造のためany型を使用
    ) as { [key: string]: any };

    config.module?.rules?.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule?.resourceQuery?.not || []), /url/],
        }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default config;
