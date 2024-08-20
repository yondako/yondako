import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "line-seed-jp": "var(--font-line-seed-jp)",
      },
      fontSize: {
        xxs: "0.625rem",
      },
      colors: {
        accent: "#A17171",
        "primary-text": "#494949",
        "secondary-text": "#9d9595",
        "primary-background": "#FFFAF6",
        "secondary-background": "#FAF9F9",
        "tertiary-background": "#fff3e9",
        "primary-border": "#494949",
        "secondary-border": "#DDDDDD",
        "tertiary-border": "#f0e1d5",
      },
      backgroundImage: {
        gradation: "url('/images/gradation.webp')",
      },
    },
  },
  plugins: [],
};

export default config;
