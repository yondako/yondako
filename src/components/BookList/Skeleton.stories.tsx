import type { Meta, StoryObj } from "@storybook/react";
import BookListSkeleton from "./Skeleton";

const meta: Meta<typeof BookListSkeleton> = {
  title: "Components/BookList/Skeleton",
  component: BookListSkeleton,
  tags: ["autodocs"],
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
  args: {
    count: 3,
  },
};

export const Few: Story = {
  args: {
    count: 2,
  },
};

export const Many: Story = {
  args: {
    count: 5,
  },
};
