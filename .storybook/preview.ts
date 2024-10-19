import { Globals } from "@react-spring/web";
import type { Preview } from "@storybook/react";
import isChromatic from "chromatic/isChromatic";
import "../src/app/globals.css";

Globals.assign({
  skipAnimation: isChromatic(),
});

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
};

export default preview;
