import type { Preview } from "@storybook/react";
import React from "react";
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
      </div>
    ),
  ],
};

export default preview;
