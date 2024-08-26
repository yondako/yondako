import type { Meta, StoryObj } from "@storybook/react";
import SideNavi from ".";

const meta: Meta<typeof SideNavi> = {
  title: "Navigation/SideNavi",
  component: SideNavi,
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
