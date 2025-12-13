import type { StorybookConfig } from "@storybook/nextjs";

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
