import type { Meta, StoryObj } from "@storybook/react";
import SideNavi from ".";

const meta: Meta<typeof SideNavi> = {
  title: "Layout/SideNavi",
  component: SideNavi,
  tags: ["autodocs"],
  parameters: {},
};

export default meta;
type Story = StoryObj<typeof SideNavi>;

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
