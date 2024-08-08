import type { Meta, StoryObj } from "@storybook/react";
import Pagination from ".";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPage: 3,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
