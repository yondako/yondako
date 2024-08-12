import type { Meta, StoryObj } from "@storybook/react";
import Pagination from ".";

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: () => {
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
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const All: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
