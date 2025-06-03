import type { Meta, StoryObj } from "@storybook/react";
import Filter from "./Filter";

const meta: Meta<typeof Filter> = {
  title: "Pages/Library/Filter",
  component: Filter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ライブラリページの書籍リストをフィルタリングするコンポーネント。ジャンル、著者、出版社などの条件で書籍を絞り込み、並び順の変更も可能です。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Filter>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なライブラリフィルターの表示例。検索ボックス、ソートオプション、フィルター項目が表示されます。",
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["library"],
      },
    },
  },
};
