import type { Meta, StoryObj } from "@storybook/react";
import LibraryBookListSkeleton from "./Skeleton";

const meta: Meta<typeof LibraryBookListSkeleton> = {
  title: "Pages/Library/BookList/Skeleton",
  component: LibraryBookListSkeleton,
  tags: ["autodocs"],
  parameters: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なライブラリ書籍リストスケルトンの表示例。フィルター部分と書籍リストのスケルトンが表示されます。",
      },
    },
  },
  args: {},
};
