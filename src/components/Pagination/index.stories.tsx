import type { Meta, StoryObj } from "@storybook/react";
import Pagination from ".";

const meta: Meta<typeof Pagination> = {
  title: "Common/Pagination",
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const All: Story = {
  render: () => {
    return (
      <>
        <h2>currentPage = 1, totalPage = 1</h2>
        <Pagination className="mt-10" currentPage={1} totalPage={1} />
        <h2>currentPage = 1, totalPage = 3</h2>
        <Pagination className="mt-10" currentPage={1} totalPage={3} />
        <h2>currentPage = 2, totalPage = 3</h2>
        <Pagination className="mt-10" currentPage={2} totalPage={3} />
        <h2>currentPage = 3, totalPage = 3</h2>
        <Pagination className="mt-10" currentPage={3} totalPage={3} />
      </>
    );
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
