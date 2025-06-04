import type { Meta, StoryObj } from "@storybook/react";
import Filter from "./Filter";

const meta: Meta<typeof Filter> = {
  title: "Pages/Library/Filter",
  component: Filter,
  tags: ["autodocs"],
  parameters: {},
};

export default meta;
type Story = StoryObj<typeof Filter>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "基本的なライブラリフィルターの表示例。検索ボックス、ソートオプション、フィルター項目が表示されます。",
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
