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
        tako: "#A17171",
        text: "#494949",
        "text-sub": "#9d9595",
        background: "#FFFAF6",
        "background-sub": "#FAF9F9",
        card: "#fdf3eb",
        line: "#DDDDDD",
        star: "#F08C43",
      },
      backgroundImage: {
        gradation: "url('/images/gradation.webp')",
      },
    },
  },
  plugins: [],
};

export default config;
