import type { Preview } from "@storybook/nextjs";
// biome-ignore lint/correctness/noUnusedImports: JSX変換にReactのインポートが必要
import React from "react";
import { DeviceProvider } from "../src/contexts/DeviceContext";
import { LibraryRevalidationProvider } from "../src/contexts/LibraryRevalidationContext";
import { ModalStateProvider } from "../src/contexts/ModalStateContext";
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
  globalTypes: {
    device: {
      description: "Device type",
      defaultValue: "desktop",
      toolbar: {
        title: "Device",
        icon: "browser",
        items: [
          { value: "desktop", title: "Desktop" },
          { value: "mobile", title: "Mobile" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDesktop = context.globals.device === "desktop";

      return (
        <DeviceProvider isDesktop={isDesktop}>
          <ModalStateProvider>
            <LibraryRevalidationProvider>
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
            </LibraryRevalidationProvider>
          </ModalStateProvider>
        </DeviceProvider>
      );
    },
  ],
};

export default preview;
