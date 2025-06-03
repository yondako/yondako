import type { Meta, StoryObj } from "@storybook/react";
import BookListSkeleton from "./Skeleton";

const meta: Meta<typeof BookListSkeleton> = {
  title: "Components/BookList/Skeleton",
  component: BookListSkeleton,
  tags: ["autodocs"],
  parameters: {},
  argTypes: {
    count: {
      control: { type: "number", min: 1, max: 6, step: 1 },
      description: "表示するスケルトンカードの数",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "基本的なBookListスケルトンの表示例。3個のスケルトンカードを表示します。",
      },
    },
  },
  args: {
    count: 3,
  },
};

export const Few: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "少ない数のスケルトン表示例。2個のスケルトンカードを表示します。",
      },
    },
  },
  args: {
    count: 2,
  },
};

export const Many: Story = {
  parameters: {
    docs: {
      description: {
        story: "多い数のスケルトン表示例。5個のスケルトンカードを表示します。",
      },
    },
  },
  args: {
    count: 5,
  },
};
