import type { Meta, StoryObj } from "@storybook/react";
import Filter from "./Filter";

const meta: Meta<typeof Filter> = {
  title: "Library/Filter",
  component: Filter,
};

export default meta;
type Story = StoryObj<typeof Filter>;

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
