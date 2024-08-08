import type { Meta, StoryObj } from "@storybook/react";
import MobileBottomNavi from ".";

const meta: Meta<typeof MobileBottomNavi> = {
  component: MobileBottomNavi,
};

export default meta;
type Story = StoryObj<typeof MobileBottomNavi>;

export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["library"],
      },
    },
  },
};
