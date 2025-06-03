import type { Preview } from "@storybook/nextjs";
import { LINESeedJP } from "../src/lib/font";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#FFFAF6",
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className={LINESeedJP.className}>
        <Story />
        {/* Portal内にフォントを適用するため */}
        <style>
          {`
            body {
              font-family: ${LINESeedJP.style.fontFamily};
            }
          `}
        </style>
      </div>
    ),
  ],
};

export default preview;
