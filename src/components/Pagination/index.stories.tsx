import type { Meta, StoryObj } from "@storybook/react";
import Pagination from ".";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    currentPage: {
      description: "現在のページ番号",
      control: { type: "number" },
    },
    totalPage: {
      description: "総ページ数",
      control: { type: "number" },
    },
    className: {
      description: "追加のCSSクラス",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const All: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "様々なページネーション状態を表示。1ページのみ、最初のページ、中間ページ、最後のページでの表示を確認できます。",
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
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
};
